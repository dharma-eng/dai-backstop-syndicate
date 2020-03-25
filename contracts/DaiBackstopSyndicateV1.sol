pragma solidity 0.5.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


interface DaiBackstopSyndicateInterface {
  enum Status {
    ACCEPTING_DEPOSITS,
    ACTIVATED,
    DEACTIVATED
  }

  // Anyone can deposit Dai up until the auctions have started at 1:1
  function deposit(uint256 daiAmount) external returns (uint256 backstopTokensMinted);

  // Anyone can withdraw at any point (open question how to handle ongoing auctions)
  function withdraw(uint256 backstopTokenAmount) external returns (uint256 daiRedeemed, uint256 mkrRedeemed);

  // Anyone can activate the contract once auctions have started, stopping deposits and enabling bids
  function activate() external;

  // Anyone can enter an auction, supplying 50,000 Dai in exchange for 500 MKR
  function enterAuction(uint256 auctionId) external;

  // (may not be necessary since this is just dent, no tend?)
  function finalizeAuction(uint256 auctionId) external;

  // Anyone can deactivate the ability to make new bids once auctions finish
  function deactivate() external;

  function getStatus() external view returns (Status status);

  function getActiveAuctions() external view returns (uint256 activeAuctions);
}


contract DaiBackstopSyndicateV1 is DaiBackstopSyndicateInterface, ERC20 {
  using SafeMath for uint256;

  // Track the status of the Syndicate.
  Status internal _status;

  // Track the number of active auctions (TODO: update this as part of withdraw)
  uint256 internal _activeAuctions;

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

  constructor() public {
    _status = Status.ACCEPTING_DEPOSITS;
  }

  function deposit(
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

    backstopTokensMinted = daiAmount;
    _mint(msg.sender, backstopTokensMinted);
  }

  function withdraw(
    uint256 backstopTokenAmount
  ) external returns (uint256 daiRedeemed, uint256 mkrRedeemed) {
    // Determine the % ownership. (scaled up by 1e18)
    uint256 shareFloat = (backstopTokenAmount.mul(1e18)).div(totalSupply());

    // Burn the tokens.
    _burn(msg.sender, backstopTokenAmount);

    // TODO: make sure that _activeAuctions is accurate!

    // Determine the Dai currently locked in auctions.
    uint256 daiLockedInAuctions = _activeAuctions.mul(50000 * 1e18);

    // Determine the Dai currently held by the contract.
    uint256 daiBalance = _DAI.balanceOf(address(this));

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
    require(_DAI.transfer(msg.sender, daiRedeemed), "Dai redemption failed.");
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
    // Determine the Dai currently held by the contract.
    uint256 daiBalance = _DAI.balanceOf(address(this));

    require(
      daiBalance >= 50000 * 1e18, "Insufficient Dai available for auction."
    );

    // TODO: ensure that the auction in question has not already been entered?

    // TODO: enter auction

    _activeAuctions = _activeAuctions.add(1);
  }

  // (may not be necessary since this is just dent, no tend?)
  function finalizeAuction(uint256 auctionId) external {
    // TODO: ensure that we are in the auction

    // TODO: finalize auction

    _activeAuctions = _activeAuctions.sub(1);
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

  function getActiveAuctions() external view returns (uint256 activeAuctions) {
    activeAuctions = _activeAuctions;
  }
}