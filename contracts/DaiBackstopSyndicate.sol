pragma solidity 0.5.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./Bidder.sol";
import "./SimpleFlopper.sol";
import "./EnumerableSet.sol";
import "../interfaces/DaiBackstopSyndicateInterface.sol";
import "../interfaces/IJoin.sol";
import "../interfaces/IVat.sol";


contract DaiBackstopSyndicate is DaiBackstopSyndicateInterface, SimpleFlopper, ERC20 {
  using SafeMath for uint256;
  using EnumerableSet for EnumerableSet.AuctionIDSet;

  // Track the status of the Syndicate.
  Status internal _status;

  // Track each active auction as an enumerable set.
  EnumerableSet.AuctionIDSet internal _activeAuctions;

  // Track the bidder address for each entered auction.
  mapping(uint256 => address) internal _bidders;

  // Syndicate can be activated once auctions start (TODO: determine this time!)
  uint256 internal constant _AUCTION_START_TIME = 1584490000;

  // The backstop price is 100 Dai for 1 MKR.
  uint256 internal constant _MKR_BACKSTOP_BID_PRICE_DENOMINATED_IN_DAI = 100;


  IERC20 internal constant _DAI = IERC20(
    0x6B175474E89094C44Da98b954EedeAC495271d0F
  );

  IERC20 internal constant _MKR = IERC20(
    0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2
  );

  IJoin internal constant _DAI_JOIN = IJoin(
    0x9759A6Ac90977b93B58547b4A71c78317f391A28
  );

  IVat internal constant _VAT = IVat(
    0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B
  );

  constructor() public {
    _status = Status.ACCEPTING_DEPOSITS;
    _VAT.hope(address(_DAI_JOIN));
    _DAI.approve(address(_DAI_JOIN), uint256(-1));
  }

  /// @notice User deposits DAI in the BackStop Syndicate and receives Syndicate shares
  /// @param daiAmount Amount of DAI to deposit 
  /// @return Amount of Backstop Syndicate shares participant receives
  function enlist(
    uint256 daiAmount
  ) external returns (uint256 backstopTokensMinted) {
    require(
      _status == Status.ACCEPTING_DEPOSITS,
      "Cannot deposit once the first auction bid has been made."
    );

    require(
      _DAI.transferFrom(msg.sender, address(this), daiAmount),
      "Could not transfer Dai amount from caller."
    );

    _DAI_JOIN.join(address(this), daiAmount);

    backstopTokensMinted = daiAmount;
    _mint(msg.sender, backstopTokensMinted);
  }

  /// @notice User withdraws DAI and MKR from BackStop Syndicate based on Syndicate shares owned
  /// @param backstopTokenAmount Amount of shares to burn
  /// @return daiRedeemed: Amount of DAI withdrawn
  /// @return mkrRedeemed: Amount of MKR withdrawn
  function defect(
    uint256 backstopTokenAmount
  ) external returns (uint256 daiRedeemed, uint256 mkrRedeemed) {
    // Determine the % ownership. (scaled up by 1e18)
    uint256 shareFloat = (backstopTokenAmount.mul(1e18)).div(totalSupply());

    // Burn the tokens.
    _burn(msg.sender, backstopTokenAmount);

    // Determine the Dai currently being used to bid in auctions.
    uint256 daiLockedInAuctions = _getActiveAuctionDaiTotal();

    // Determine the Dai currently locked up on behalf of this contract.
    uint256 daiBalance = _VAT.dai(address(this));

    // Combine Dai locked in auctions with the balance on the contract.
    uint256 combinedDai = daiLockedInAuctions.add(daiBalance);

    // Determine the Maker currently held by the contract.
    uint256 makerBalance = _MKR.balanceOf(address(this));

    // Determine the amount of Dai and MKR to redeem based on the share.
    daiRedeemed = combinedDai.mul(shareFloat) / 1e18;
    mkrRedeemed = makerBalance.mul(shareFloat) / 1e18;

    // Ensure that sufficient Dai liquidity is currently available to withdraw.
    require(
      daiRedeemed <= daiBalance, "Insufficient Dai (in use in auctions)"
    );

    // Redeem the Dai and MKR.
    _DAI_JOIN.exit(msg.sender, daiRedeemed);
    require(_MKR.transfer(msg.sender, mkrRedeemed), "MKR redemption failed.");
  }

  /// @notice Triggers syndicate participation in an auction, bidding 50k DAI for 500 MKR
  /// @param auctionId ID of the auction to participate in
  function enterAuction(uint256 auctionId) external {
    require(
      block.timestamp >= _AUCTION_START_TIME,
      "Cannot enter an auction before they have started."
    );

    // Ensure that the auction in question has not already been entered
    require(
      !_activeAuctions.contains(auctionId), "Already participating in this auction"
    );

    // Determine the Dai currently held by the contract.
    uint256 daiBalance = _DAI.balanceOf(address(this));
    require(
      daiBalance >= 50000 * 1e18, "Insufficient Dai available for auction."
    );

    // Ensure that the current bid is not at a higher price than backstop.
    (uint256 currentDaiBid, uint256 curentLotSize, , , ) = getCurrentBid(auctionId);

    // Current price - Rounding error if curentLotSize is large wrt to DAI bid
    // Should require curentLotSize * beg if current bid price is below 100:1
    (uint256 beg, , , ) = getAuctionInformation();
    // uint256 newBidPrice = currentDaiBid / (curentLotSize.mul(beg));
    // require(
    //   newBidPrice <= _MKR_BACKSTOP_BID_PRICE_DENOMINATED_IN_DAI, 
    //   "Current bid is higher than Syndicate bid"
    // );

    // Prevent further deposits
    if (_status != Status.ACTIVATED) {
      _status = Status.ACTIVATED;
    }

    // Enter the auction.
    // We don't to hardcode this, use vow.sump() and lotsize and bid values 
    // for a price of at most 100:1. The `beg` could prevent us from
    // participating at 500 MKR lot size, but could allow at 501 MKR.
    // See; https://docs.makerdao.com/smart-contract-modules/system-stabilizer-module/flop-detailed-documentation#bidding-requirements-during-an-auction 
    // Should pass curentLotSize * beg if current bid price is below 100:1
    _bid(auctionId, 500 * 1e18, 50000 * 1e18);

    // Register auction if successful participation
    _activeAuctions.add(auctionId);
  }

  // Anyone can finalize an auction if it's ready
  function finalizeAuction(uint256 auctionId) external {
    // TODO: ensure that we are in the auction
    // ^ Do we care? It should just fail 
    
    // TODO: finalize auction

    _activeAuctions.remove(auctionId);
  }

  function getStatus() external view returns (Status status) {
    status = _status;
  }

  function getActiveAuctions() external view returns (uint256[] memory activeAuctions) {
    activeAuctions = _activeAuctions.enumerate();
  }

  function _getActiveAuctionDaiTotal() internal view returns (uint256 dai) {
    dai = 0;
    uint256[] memory activeAuctions = _activeAuctions.enumerate();

    uint256 auctionDai;
    for (uint256 i = 0; i < activeAuctions.length; i++) {
      (auctionDai, , , , ) = getCurrentBid(activeAuctions[i]);
      dai += auctionDai;
    }
  }
}