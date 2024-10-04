// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../interfaces/IERC20Mintable.sol";

contract MockERC20 is ERC20("MockERC20", "MOCK"), IERC20Mintable {
    function mint(address recipient, uint256 amount) external {
        _mint(recipient, amount);
    }
}
