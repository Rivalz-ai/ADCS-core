// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAlchemySmartAccount {
    function execute(address target, bytes calldata callData) external;
    // Add other functions you need to interact with
}
