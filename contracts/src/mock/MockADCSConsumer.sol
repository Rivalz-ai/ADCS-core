// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../ADCSConsumerFulfill.sol";

contract MockADCSConsumer is
    ADCSConsumerFulfillUint256,
    ADCSConsumerFulfillBool,
    ADCSConsumerFulfillBytes32,
    ADCSConsumerFulfillBytes
{
    using ADCS for ADCS.Request;
    uint256 public lastUint256;
    bool public lastBool;
    bytes32 public lastBytes32;
    bytes public lastBytes;

    event DataRequestedUint256(uint256 indexed requestId);
    event DataRequestedBool(uint256 indexed requestId);
    event DataRequestedBytes32(uint256 indexed requestId);
    event DataRequestedBytes(uint256 indexed requestId);

    constructor(address _coordinator) ADCSConsumerBase(_coordinator) {}

    function requestUint256Data(
        uint32 _callbackGasLimit,
        bytes32 _jobId
    ) external returns (uint256 requestId) {
        bytes32 typeId = keccak256(abi.encodePacked("uint128"));
        ADCS.Request memory req = buildRequest(_jobId, typeId);
        req.add("from", "BTC");
        req.add("to", "USDT");
        requestId = COORDINATOR.requestData(_callbackGasLimit, req);
        emit DataRequestedUint256(requestId);
    }

    function requestBoolData(
        uint32 _callbackGasLimit,
        bytes32 _jobId
    ) external returns (uint256 requestId) {
        bytes32 typeId = keccak256(abi.encodePacked("bool"));
        ADCS.Request memory req = buildRequest(_jobId, typeId);
        req.add("from", "BTC");
        requestId = COORDINATOR.requestData(_callbackGasLimit, req);
        emit DataRequestedBool(requestId);
    }

    function requestBytes32Data(
        uint32 _callbackGasLimit,
        bytes32 _jobId
    ) external returns (uint256 requestId) {
        ADCS.Request memory req = buildRequest(_jobId, keccak256(abi.encodePacked("bytes32")));
        req.add("from", "BTC");
        requestId = COORDINATOR.requestData(_callbackGasLimit, req);
        emit DataRequestedBytes32(requestId);
    }

    function requestBytesData(
        uint32 _callbackGasLimit,
        bytes32 _jobId
    ) external returns (uint256 requestId) {
        ADCS.Request memory req = buildRequest(_jobId, keccak256(abi.encodePacked("bytes")));
        req.add("from", "BTC");
        requestId = COORDINATOR.requestData(_callbackGasLimit, req);
        emit DataRequestedBytes(requestId);
    }

    function fulfillDataRequest(uint256, uint256 response) internal virtual override {
        lastUint256 = response;
    }

    function fulfillDataRequest(uint256, bool response) internal virtual override {
        lastBool = response;
    }

    function fulfillDataRequest(uint256, bytes32 response) internal virtual override {
        lastBytes32 = response;
    }

    function fulfillDataRequest(uint256, bytes memory response) internal virtual override {
        lastBytes = response;
    }
}
