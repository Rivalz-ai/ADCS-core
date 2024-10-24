// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IADCSCoordinator.sol";

abstract contract ADCSConsumerBase {
    using ADCS for ADCS.Request;

    struct StringAndBool {
        string name;
        bool response;
    }
    error OnlyCoordinatorCanFulfill(address have, address want);
    mapping(bytes32 => bytes4) private sTypeIdToFunctionSelector;
    IADCSCoordinator public immutable COORDINATOR;

    /**
     * @param _adcsResponseCoordinator address of ADCSCoordinator contract
     */
    constructor(address _adcsResponseCoordinator) {
        COORDINATOR = IADCSCoordinator(_adcsResponseCoordinator);

        sTypeIdToFunctionSelector[keccak256(abi.encodePacked("uint256"))] = COORDINATOR
            .fulfillDataRequestUint256
            .selector;
        sTypeIdToFunctionSelector[keccak256(abi.encodePacked("bool"))] = COORDINATOR
            .fulfillDataRequestBool
            .selector;
        sTypeIdToFunctionSelector[keccak256(abi.encodePacked("bytes32"))] = COORDINATOR
            .fulfillDataRequestBytes32
            .selector;
        sTypeIdToFunctionSelector[keccak256(abi.encodePacked("bytes"))] = COORDINATOR
            .fulfillDataRequestBytes
            .selector;

        sTypeIdToFunctionSelector[keccak256(abi.encodePacked("stringAndbool"))] = COORDINATOR
            .fulfillDataRequestStringAndBool
            .selector;
    }

    /**
     * @notice Build a request using the Orakl library
     * @param jobId the job specification ID that the request is created for
     * @param typeId the reponse type ID that the request is created for
     * @return req request in memory
     */
    function buildRequest(
        bytes32 jobId,
        bytes32 typeId
    ) internal view returns (ADCS.Request memory req) {
        return req.initialize(jobId, address(COORDINATOR), sTypeIdToFunctionSelector[typeId]);
    }

    modifier verifyRawFulfillment() {
        address coordinatorAddress = address(COORDINATOR);
        if (msg.sender != coordinatorAddress) {
            revert OnlyCoordinatorCanFulfill(msg.sender, coordinatorAddress);
        }
        _;
    }
}
