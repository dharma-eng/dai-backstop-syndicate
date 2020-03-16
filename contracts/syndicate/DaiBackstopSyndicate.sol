pragma solidity 0.5.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./SimpleFlopper.sol";
import "./EnumerableSet.sol";
import "../interfaces/IDaiBackstopSyndicate.sol";
import "../interfaces/IJoin.sol";
import "../interfaces/IVat.sol";


contract DaiBackstopSyndicate is IDaiBackstopSyndicate, SimpleFlopper, ERC20 {
  using SafeMath for uint256;
  using EnumerableSet for EnumerableSet.AuctionIDSet;

  // Track the status of the Syndicate.
  Status internal _status;

  // Track each active auction as an enumerable set.
  EnumerableSet.AuctionIDSet internal _activeAuctions;

  // The backstop price is 100 Dai for 1 MKR (logic implemented in bidder)
  uint256 internal constant _MKR_BACKSTOP_BID_PRICE_DENOMINATED_IN_DAI = 100;

  // IERC20 internal constant _DAI = IERC20(
  //   0x6B175474E89094C44Da98b954EedeAC495271d0F
  // );

  // IERC20 internal constant _MKR = IERC20(
  //   0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2
  // );

  // IJoin internal constant _DAI_JOIN = IJoin(
  //   0x9759A6Ac90977b93B58547b4A71c78317f391A28
  // );

  // IVat internal constant _VAT = IVat(
  //   0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B
  // );

  IERC20 internal _DAI;
  IERC20 internal _MKR;
  IJoin internal _DAI_JOIN;
  IVat internal _VAT;

  constructor(
    address dai_,
    address mkr_,
    address daiJoin_,
    address vat_,
    address flopper_
  ) SimpleFlopper(flopper_) public
  {
    _status = Status.ACCEPTING_DEPOSITS;
    _DAI = IERC20(dai_);
    _MKR = IERC20(mkr_);
    _DAI_JOIN = IJoin(daiJoin_);
    _VAT = IVat(vat_);
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
      "DaiBackstopSyndicate/enlist: Cannot deposit once the first auction bid has been made."
    );

    require(
      _DAI.transferFrom(msg.sender, address(this), daiAmount),
      "DaiBackstopSyndicate/enlist: Could not transfer Dai amount from caller."
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
    uint256 vatDaiLockedInAuctions = _getActiveAuctionVatDaiTotal();

    // Determine the Dai currently locked up on behalf of this contract.
    uint256 vatDaiBalance = _VAT.dai(address(this));

    // Combine Dai locked in auctions with the balance on the contract.
    uint256 combinedVatDai = vatDaiLockedInAuctions.add(vatDaiBalance);

    // Determine the Maker currently held by the contract.
    uint256 makerBalance = _MKR.balanceOf(address(this));

    // Determine the amount of Dai and MKR to redeem based on the share.
    uint256 vatDaiRedeemed = combinedVatDai.mul(shareFloat) / 1e18;
    mkrRedeemed = makerBalance.mul(shareFloat) / 1e18;

    // daiRedeemed is the e18 version of vatDaiRedeemed (e45). Needed for dai token, otherwise we keep decimals of vatDai
    daiRedeemed = vatDaiRedeemed / 1e27;


    // Ensure that sufficient Dai liquidity is currently available to withdraw.
    require(
      vatDaiRedeemed <= vatDaiBalance, "DaiBackstopSyndicate/defect: Insufficient Dai (in use in auctions)"
    );

    // Redeem the Dai and MKR, giving user vatDai if global settlement, otherwise, tokens
    if (isEnabled()) {
      _DAI_JOIN.exit(msg.sender, daiRedeemed);
    } else {
      _VAT.move(address(this), msg.sender, vatDaiRedeemed);
    }
    require(_MKR.transfer(msg.sender, mkrRedeemed), "DaiBackstopSyndicate/defect: MKR redemption failed.");
  }

  /// @notice Triggers syndicate participation in an auction, bidding 50k DAI for 500 MKR
  /// @param auctionId ID of the auction to participate in
  function enterAuction(uint256 auctionId) external {
    require(
      !_activeAuctions.contains(auctionId),
      "DaiBackstopSyndicate/enterAuction: Auction already active"
    );

    // dai has 45 decimal places
    (uint256 amountDai, , , , ) = SimpleFlopper.getCurrentBid(auctionId);

    // lot needs to have 18 decimal places, and we're expecting 1 mkr == 100 dai
    uint256 expectedLot = (amountDai / 1e27) / 100;

    // Place the bid, reverting on failure.
    SimpleFlopper._bid(auctionId, expectedLot, amountDai);

    // Prevent further deposits.
    if (_status != Status.ACTIVATED) {
      _status = Status.ACTIVATED;
    }

    // Register auction if successful participation.
    _activeAuctions.add(auctionId);

    // Emit an event to signal that the auction was entered.
    emit AuctionEntered(auctionId, expectedLot, amountDai);
  }

  // Anyone can finalize an auction if it's ready
  function finalizeAuction(uint256 auctionId) external {
    require(
      _activeAuctions.contains(auctionId),
      "DaiBackstopSyndicate/enterAuction: Auction already finalized"
    );

    // If auction was finalized, end should be 0x0.
    (,, address bidder,, uint48 end) = SimpleFlopper.getCurrentBid(auctionId);

    // If auction isn't closed, we try to close it ourselves
    if (end != 0) {
      // If we are the winning bidder, we finalize the auction
      // Otherwise we got outbid and we withdraw DAI
      if (bidder == address(this)) {
        SimpleFlopper._finalize(auctionId);
      }
    }

    // Remove the auction from the set of active auctions.
    _activeAuctions.remove(auctionId);

    // Emit an event to signal that the auction was finalized.
    emit AuctionFinalized(auctionId);
  }

  function getStatus() external view returns (Status status) {
    status = _status;
  }

  function getActiveAuctions() external view returns (uint256[] memory activeAuctions) {
    activeAuctions = _activeAuctions.enumerate();
  }

  function _getActiveAuctionVatDaiTotal() internal view returns (uint256 vatDai) {
    vatDai = 0;
    uint256[] memory activeAuctions = _activeAuctions.enumerate();

    uint256 auctionVatDai;
    address bidder;
    for (uint256 i = 0; i < activeAuctions.length; i++) {
      // Dai bid size is returned from getCurrentBid with 45 decimals
      (auctionVatDai,, bidder,,) = SimpleFlopper.getCurrentBid(activeAuctions[i]);
      if (bidder == address(this)) {
        // we are keeping the 45 decimals in case we need to return vatDai
        vatDai.add(auctionVatDai);
      }
    }
  }
}
