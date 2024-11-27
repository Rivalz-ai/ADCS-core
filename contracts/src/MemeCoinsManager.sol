// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MemeCoinsManager {
    address public owner;
    
    event MemeCoinBought(address indexed buyer, address indexed tokenAddress, uint256 amount);
    event MemeCoinWithdrawn(address indexed receiver, uint256 totalAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    mapping(address => uint256) public memecoinBalances;

    function getMemecoins() public view returns (address[] memory, uint256[] memory) {
        address[] memory addresses = new address[](3);
        uint256[] memory balances = new uint256[](3);

        addresses[0] = address(0x1111111111111111111111111111111111111111);
        addresses[1] = address(0x2222222222222222222222222222222222222222);
        addresses[2] = address(0x3333333333333333333333333333333333333333);

        balances[0] = memecoinBalances[addresses[0]];
        balances[1] = memecoinBalances[addresses[1]];
        balances[2] = memecoinBalances[addresses[2]];

        return (addresses, balances);
    }

    function buyMemeCoin(address memecoinAddress, uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        emit MemeCoinBought(msg.sender, memecoinAddress, amount);
    }

    function withdraw() public onlyOwner {
        emit MemeCoinWithdrawn(msg.sender, 6000000);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        owner = newOwner;
    }
}
