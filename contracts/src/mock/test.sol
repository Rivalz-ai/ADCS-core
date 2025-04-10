// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TestAdcs {
    event DataRequested(
        uint256 indexed requestId,
        uint256 callbackGasLimit,
        address indexed sender,
        bytes32 jobId,
        uint256 blockNumber,
        bytes data
    );

    constructor() {}

    function requestData(
        uint256 requestId,
        uint256 callbackGasLimit,
        bytes32 jobId,
        bytes memory data
    ) external {
        emit DataRequested(requestId, callbackGasLimit, msg.sender, jobId, block.number, data);
    }
}
