pragma solidity 0.5.16;

import "./IFlopper.sol";

contract SimpleFlopper {

  IFlopper private _flopper;

  constructor(address flopper) public {
    _flopper = IFlopper(flopper);
  }

  // Getters //

  /// @notice Get the status of the flopper contract
  /// @return bool status true if flopper contract is enabled
  function isEnabled() public view returns (bool status) {
    return (_flopper.live() == 1) ? true : false;
  }

  /// @notice Get the id of the latest auction
  /// @return auctionID uint256 id
  function getNumAuctions() public view returns (uint256 auctionID) {
    return _flopper.kicks();
  }

  /// @notice Get the address of the MKR token
  /// @return MKR address of maker token
  function getMKRAddress() public view returns (address MKR) {
    return _flopper.gem();
  }

  /// @notice Get the address of the DAI token
  /// @return DAI address of maker token
  function getDAIAddress() public view returns (address DAI) {
    return _flopper.vat();
  }

  /// @notice Get the flopper contract config
  /// @return bidIncrement uint256 minimum bid increment as percentage (initial = 1.05E18)
  /// @return repriceIncrement uint256 reprice increment as percentage (initial = 1.50E18)
  /// @return bidDuration uint256 duration of a bid in seconds (initial = 3 hours)
  /// @return auctionDuration uint256 initial duration of an auction in seconds (initial = 2 days)
  function getConfig() public view returns (
    uint256 bidIncrement,
    uint256 repriceIncrement,
    uint256 bidDuration,
    uint256 auctionDuration
  ) {
    return (_flopper.beg(), _flopper.pad(), _flopper.ttl(), _flopper.tau());
  }

  /// @notice Get the winning bid for an auction
  /// @return amountDAI uint256 amount of DAI to be burned
  /// @return amountMKR uint256 amount of MKR to be minted
  /// @return bidder address account who placed bid
  /// @return bidDeadline uint48 deadline of bid
  /// @return auctionDeadline uint48 deadline of auction
  function getCurrentBid(uint256 auctionID) public view returns (
    uint256 amountDAI,
    uint256 amountMKR,
    address bidder,
    uint48 bidDeadline,
    uint48 auctionDeadline
  ) {
    IFlopper.Bid memory bid = _flopper.bids(auctionID);
    return (bid.bid, bid.lot, bid.guy, bid.tic, bid.end);
  }

  // Setters //

  /// @notice Extend and reprice expired auction with no bid
  /// @dev state machine: after auction expiry, before first bid
  /// @param auctionID uint256 id of the auction
  function reprice(uint256 auctionID) internal {
    _flopper.tick(auctionID);
  }

  /// @notice Add bid to a live auction, if first bid this transfers DAI to vat
  /// @dev state machine: before auction expired
  /// @param auctionID uint256 id of the auction
  function bid(uint256 auctionID, uint256 amountMKR, uint256 amountDAI) internal {
    _flopper.dent(auctionID, amountMKR, amountDAI);
  }

  /// @notice Finalize an auction with a winning bid and release maker
  /// @dev state machine: after auction expired
  /// @param auctionID uint256 id of the auction
  function finalize(uint256 auctionID) internal {
    _flopper.deal(auctionID);
  }

}