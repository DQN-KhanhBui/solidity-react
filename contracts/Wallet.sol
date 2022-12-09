// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Wallet {
  uint256 public numOfFunders; // SO LUONG NGUOI DONATE
  mapping(uint256 => address) public funders; // MANG CHUA ADDRESS WALLET DA DONATE
  mapping(address => bool) public isFunders; // CHECK ADDRESS DA DONATE CHUA???

  receive() external payable {}

  /*
  ** addFunder()
  ** getFunderIndex(uint256 index) => returns(address)
  ** getAllFunder()                => returns(address[] memory)
  ** modify limitWithdraw(uint256 withdrawAmout)
  ** withdraw(uint256 withdrawAmount)
  */

  function addFunder() external payable {
    address funder = msg.sender;
    if(!isFunders[funder]) {
      uint index = numOfFunders++;
      isFunders[funder] = true;
      funders[index] = funder;
    }
  }

  function getFunderIndex(uint256 index) external view returns(address) {
    return funders[index];
  }

  function getAllFunder() external view returns(address[] memory) {
    address[] memory _funders = new address[](numOfFunders);
    for(uint256 i=0; i<numOfFunders; i++) {
      _funders[i] = funders[i];
    }
    return _funders;
  }

  modifier limitWithdraw(uint256 withdrawAmount) {
    require(withdrawAmount <= 1*(10**18), "Can't withdraw more than 1ETH");
    _;
  }

  function withdraw(uint256 withdrawAmount) external limitWithdraw(withdrawAmount) {
    payable(msg.sender).transfer(withdrawAmount);
  }
}