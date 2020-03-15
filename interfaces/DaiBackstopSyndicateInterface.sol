pragma solidity 0.5.16;


interface DaiBackstopSyndicateInterface {
  enum Status {
    ACCEPTING_DEPOSITS,
    ACTIVATED,
    DEACTIVATED
  }

  // Anyone can deposit Dai up until the auctions have started at 1:1
  function enlist(uint256 daiAmount) external returns (uint256 backstopTokensMinted);

  // Anyone can withdraw at any point as long as Dai is not locked in auctions
  function defect(uint256 backstopTokenAmount) external returns (uint256 daiRedeemed, uint256 mkrRedeemed);

  // Anyone can activate the contract once auctions have started, stopping deposits and enabling bids
  function activate() external;

  // Anyone can enter an auction, supplying 50,000 Dai in exchange for 500 MKR
  function enterAuction(uint256 auctionId) external;

  // (may not be necessary since this is just dent, no tend?)
  function finalizeAuction(uint256 auctionId) external;

  // Anyone can deactivate the ability to make new bids once auctions finish
  function deactivate() external;

  function getStatus() external view returns (Status status);

  function getActiveAuctions() external view returns (uint256[] memory activeAuctions);
}