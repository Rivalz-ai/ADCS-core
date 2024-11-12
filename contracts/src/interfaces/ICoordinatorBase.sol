// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface ICoordinatorBase {
    /**
     * @notice Sets the configuration of the VRF coordinator
     * @param maxGasLimit global max for request gas limit
     * @param gasAfterPaymentCalculation gas used in doing accounting
     * after completing the gas measurement
     */
    function setConfig(uint256 maxGasLimit, uint256 gasAfterPaymentCalculation) external;

    function pendingRequestExists(address consumer, uint64 nonce) external view returns (bool);

    /**
     * @notice Get request commitment.
     * @param requestId id of request
     * @return commmitment value that can be used to determine whether
     * a request is fulfilled or not. If `requestId` is valid and
     * commitment equals to bytes32(0), the request was fulfilled.
     */
    function getCommitment(uint256 requestId) external view returns (bytes32);

    /**
     * @notice Canceling oracle request
     * @param requestId - ID of the Oracle Request
     */
    function cancelRequest(uint256 requestId) external;
}
