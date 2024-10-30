// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../ADCSConsumerFulfill.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockADCSConsumerBytes is ADCSConsumerFulfillBytes, Ownable {
    using ADCS for ADCS.Request;

    // Store the last received response for testing
    bytes public lastResponse;
    uint256 public lastRequestId;

    event DataRequested(uint256 indexed requestId);
    event DataFulfilled(uint256 indexed requestId, bytes response);

    constructor(address coordinator) ADCSConsumerBase(coordinator) Ownable(msg.sender) {}

    // Function to request bytes data
    function requestBytesData(
        bytes32 jobId,
        uint32 callbackGasLimit,
        string memory _from
    ) external onlyOwner returns (uint256 requestId) {
        bytes32 typeId = keccak256(abi.encodePacked("bytes32"));
        ADCS.Request memory req = buildRequest(jobId, typeId);
        req.add("from", _from);
        requestId = COORDINATOR.requestData(callbackGasLimit, req);
        emit DataRequested(requestId);
        return requestId;
    }

    // Implementation of the fulfill function for bytes
    function fulfillDataRequest(uint256 requestId, bytes memory response) internal override {
        lastRequestId = requestId;
        lastResponse = response;
        emit DataFulfilled(requestId, response);
    }

    // Helper function to get the typeId for bytes
    function getTypeId() external pure returns (bytes32) {
        return keccak256(abi.encodePacked("bytes"));
    }
}
