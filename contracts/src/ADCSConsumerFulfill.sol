// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ADCSConsumerBase.sol";

abstract contract ADCSConsumerFulfillUint256 is ADCSConsumerBase {
    function fulfillDataRequest(uint256 requestId, uint256 response) internal virtual;

    function rawFulfillDataRequest(
        uint256 requestId,
        uint256 response
    ) external verifyRawFulfillment {
        fulfillDataRequest(requestId, response);
    }
}

abstract contract ADCSConsumerFulfillBool is ADCSConsumerBase {
    function fulfillDataRequest(uint256 requestId, bool response) internal virtual;

    function rawFulfillDataRequest(uint256 requestId, bool response) external verifyRawFulfillment {
        fulfillDataRequest(requestId, response);
    }
}

abstract contract ADCSConsumerFulfillBytes32 is ADCSConsumerBase {
    function fulfillDataRequest(uint256 requestId, bytes32 response) internal virtual;

    function rawFulfillDataRequest(
        uint256 requestId,
        bytes32 response
    ) external verifyRawFulfillment {
        fulfillDataRequest(requestId, response);
    }
}

abstract contract ADCSConsumerFulfillBytes is ADCSConsumerBase {
    function fulfillDataRequest(uint256 requestId, bytes memory response) internal virtual;

    function rawFulfillDataRequest(
        uint256 requestId,
        bytes memory response
    ) external verifyRawFulfillment {
        fulfillDataRequest(requestId, response);
    }
}

abstract contract ADCSConsumerFulfillStringAndBool is ADCSConsumerBase {
    function fulfillDataRequest(uint256 requestId, StringAndBool memory response) internal virtual;

    function rawFulfillDataRequest(
        uint256 requestId,
        StringAndBool memory response
    ) external verifyRawFulfillment {
        fulfillDataRequest(requestId, response);
    }
}
