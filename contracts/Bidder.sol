pragma solidity 0.5.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./SimpleFlopper.sol";
import "../interfaces/IVat.sol";


contract Bidder is SimpleFlopper {
  IVat internal constant _VAT = IVat(
    0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B
  );

  IERC20 internal constant _MKR = IERC20(
    0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2
  );

  address public owner;
  uint256 public auctionID;
  uint256 public expectedLot;
  bool public bidSubmited;

  /// @param auctionID_ ID of auction to participate in
  constructor(address auctionAddress_, uint256 auctionID_) public SimpleFlopper(auctionAddress_) {
    owner = msg.sender;
    auctionID = auctionID_;
  }

  /// @notice Enters a given auction with bid of 1 mkr == 100 DAI
  function submitBid() external {
    require(msg.sender == owner, "Bidder/submitBid: owner only");
    require(!bidSubmited, "Bidder/submitBid: bid already submitted");

    // dai has 45 decimal places
    (uint256 amountDai, , , , ) = SimpleFlopper.getCurrentBid(auctionID);

    // lot needs to have 18 decimal places, and we're expecting 1 mkr == 100 dai
    expectedLot = (amountDai / 1e27) / 100;

    _VAT.move(owner, address(this), amountDai);
    // ??? Does our Bidder need to approve the Flopper?
    SimpleFlopper._bid(auctionID, expectedLot, amountDai);

    // Mark bid as successful 
    bidSubmited = true;
  }

  // Will withdraw funds to owner if auction is concluded or outbidded
  function finalize() external returns (bool) {
    require(msg.sender == owner, "Bidder/finalize: owner only");
    require(bidSubmited, "Bidder/finalize: Bid not yet submitted");

    // If auction was finalized, end should be 0x0.
    ( , ,address bidder, , uint48 end) = SimpleFlopper.getCurrentBid(auctionID);

    // If auction isn't closed, we try to close it ourselves
    if (end != 0) {
      // If we are the winning bidder, we finalize the auction
      // Otherwise we got outbid and we withdraw DAI
      if (bidder == address(this)) {
        SimpleFlopper._finalize(auctionID);
      } 
    }

    uint256 mkrBalance = _MKR.balanceOf(address(this));
    uint256 daiBalance = _VAT.dai(address(this));

    bool didWin = mkrBalance >= expectedLot;

    if (mkrBalance > 0) {
      require(
        _MKR.transfer(owner, mkrBalance), "Bidder/finalize: transfer failed"
      );
    }

    if (daiBalance > 0) {
      _VAT.move(address(this), owner, daiBalance);
    }

    return didWin;
  }
}
