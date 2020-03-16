pragma solidity 0.5.16;


interface IDaiBackstopSyndicate {
  event AuctionEntered(uint256 auctionId, address bidder);
  event AuctionFinalized(uint256 auctionId, address bidder);

  enum Status {
    ACCEPTING_DEPOSITS,
    ACTIVATED
  }

  // Anyone can deposit Dai up until the auctions have started at 1:1
  function enlist(uint256 daiAmount) external returns (uint256 backstopTokensMinted);

  // Anyone can withdraw at any point as long as Dai is not locked in auctions
  function defect(uint256 backstopTokenAmount) external returns (uint256 daiRedeemed, uint256 mkrRedeemed);

  // Anyone can enter an auction for the syndicate, bidding Dai in return for MKR
  function enterAuction(uint256 auctionId) external;

  // Anyone can finalize an auction, returning the Dai or MKR to the syndicate
  function finalizeAuction(uint256 auctionId) external;

  function getStatus() external view returns (Status status);

  function getActiveAuctions() external view returns (uint256[] memory activeAuctions);
}