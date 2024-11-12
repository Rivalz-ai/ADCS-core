// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "../libraries/ADCS.sol";

interface IADCSCoordinatorBase {
    // RequestCommitment holds information sent from off-chain oracle
    // describing details of request.
    struct RequestCommitment {
        uint64 blockNum;
        uint256 callbackGasLimit;
        address sender;
        bytes32 jobId;
    }

    struct StringAndBool {
        string name;
        bool response;
    }

    function requestData(
        uint256 callbackGasLimit,
        ADCS.Request memory req
    ) external returns (uint256);

    function fulfillDataRequestUint256(
        uint256 requestId,
        uint256 response,
        RequestCommitment memory rc
    ) external;

    function fulfillDataRequestBool(
        uint256 requestId,
        bool response,
        RequestCommitment memory rc
    ) external;

    function fulfillDataRequestBytes32(
        uint256 requestId,
        bytes32 response,
        RequestCommitment memory rc
    ) external;

    function fulfillDataRequestBytes(
        uint256 requestId,
        bytes memory response,
        RequestCommitment memory rc
    ) external;

    function fulfillDataRequestStringAndBool(
        uint256 requestId,
        StringAndBool memory response,
        RequestCommitment memory rc
    ) external;
}
