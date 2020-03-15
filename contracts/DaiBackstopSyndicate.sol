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

  function enlist(
    uint256 daiAmount
  ) external returns (uint256 backstopTokensMinted) {
    require(
      _status == Status.ACCEPTING_DEPOSITS,
      "Cannot deposit once auctions are activated."
    );

    require(
      _DAI.transferFrom(msg.sender, address(this), daiAmount),
      "Could not transfer Dai amount from caller."
    );

    _DAI_JOIN.join(address(this), daiAmount);

    backstopTokensMinted = daiAmount;
    _mint(msg.sender, backstopTokensMinted);
  }

  function defect(
    uint256 backstopTokenAmount
  ) external returns (uint256 daiRedeemed, uint256 mkrRedeemed) {
    // Determine the % ownership. (scaled up by 1e18)
    uint256 shareFloat = (backstopTokenAmount.mul(1e18)).div(totalSupply());

    // Burn the tokens.
    _burn(msg.sender, backstopTokenAmount);

    // TODO: make sure that _activeAuctions is accurate!

    // Determine the Dai currently locked in auctions.
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

  function activate() external {
    require(
      _status == Status.ACCEPTING_DEPOSITS,
      "Cannot activate again after a prior activation."
    );

    require(
      block.timestamp >= _AUCTION_START_TIME,
      "Cannot activate until MKR auctions have started."
    );

    // Determine the Dai currently held by the contract.
    uint256 daiBalance = _DAI.balanceOf(address(this));

    // Jump straight to deactivated if there is not enough dai to make auctions.
    if (daiBalance < 50000 * 1e18) {
      _status = Status.DEACTIVATED;
    } else {
      // Set the status as active.
      _status = Status.ACTIVATED;
    }
  }

  // Anyone can enter an auction, supplying 50,000 Dai in exchange for 500 MKR
  function enterAuction(uint256 auctionId) external {
    require(
      _status == Status.ACTIVATED,
      "Cannot enter an auction unless this contract is activated."
    );

    // Determine the Dai currently held by the contract.
    uint256 daiBalance = _DAI.balanceOf(address(this));

    require(
      daiBalance >= 50000 * 1e18, "Insufficient Dai available for auction."
    );

    // TODO: ensure that the auction in question has not already been entered?

    // TODO: ensure that the current bid is not at a higher price than backstop.

    // Enter the auction.
    _bid(auctionId, 500 * 1e18, 50000 * 1e18);

    _activeAuctions.add(auctionId);
  }

  // Anyone can finalize an auction if it's ready
  function finalizeAuction(uint256 auctionId) external {
    // TODO: ensure that we are in the auction

    // TODO: finalize auction

    _activeAuctions.remove(auctionId);
  }

  function deactivate() external {
    require(
      _status == Status.ACTIVATED,
      "Cannot deactivate unless currently active."
    );

    // TODO: determine that MKR auction is over (check the surplus?)

    _status = Status.DEACTIVATED;
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