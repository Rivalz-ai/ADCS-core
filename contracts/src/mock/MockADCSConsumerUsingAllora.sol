// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../ADCSConsumerFulfill.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockADCSConsumerUsingAllora is ADCSConsumerFulfillBool, Ownable {
    using ADCS for ADCS.Request;

    bool public lastBool;

    event DataRequestedPredictPrice(uint256 indexed requestId);

    constructor(address _coordinator) ADCSConsumerBase(_coordinator) Ownable(_msgSender()) {}

    function requestPredictPrice(
        uint32 _callbackGasLimit,
        bytes32 _jobId,
        string memory coinName,
        string memory predictionType // currently only support "5m" and "8h"
    ) external returns (uint256 requestId) {
        bytes32 typeId = keccak256(abi.encodePacked("bool"));
        ADCS.Request memory req = buildRequest(_jobId, typeId);
        req.add("coinName", coinName);
        req.add("predictionType", predictionType);
        requestId = COORDINATOR.requestData(_callbackGasLimit, req);
        emit DataRequestedPredictPrice(requestId);
    }

    function fulfillDataRequest(uint256, bool response) internal virtual override {
        lastBool = response;
    }
}
