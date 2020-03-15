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
  uint256 public bid;
  uint256 public amountBid;
  uint256 public expectedLot;

  constructor(uint256 bid_) public {
    owner = msg.sender;
    bid = bid_;
  }

  function submitBid() external {
    require(msg.sender == owner, "Bidder/submitBid: owner only");

    (uint256 amountDai, , , , ) = getCurrentBid(bid);

    amountBid = amountDai;
    expectedLot = amountDai / 100;

    _VAT.move(owner, address(this), amountBid);
    _bid(bid, expectedLot, amountBid); // 100 dai = 1 mkr
  }

  function finalize() external returns (bool) {
    require(msg.sender == owner, "Bidder/finalize: owner only");

    ( , , , , uint48 end) = getCurrentBid(bid);
    require(end == 0, "Bidder/finalize: auction not finished");

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