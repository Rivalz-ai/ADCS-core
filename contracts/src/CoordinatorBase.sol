// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ICoordinatorBase.sol";

abstract contract CoordinatorBase is Ownable, ICoordinatorBase {
    // 5k is plenty for an EXTCODESIZE call (2600) + warm CALL (100)
    // and some arithmetic operations.
    uint256 private constant GAS_FOR_CALL_EXACT_CHECK = 5_000;

    address[] public sOracles;

    /* requestID */
    /* commitment */
    mapping(uint256 => bytes32) internal sRequestIdToCommitment;

    /* requestID */
    /* owner */
    mapping(uint256 => address) internal sRequestOwner;

    struct Config {
        uint32 maxGasLimit;
        bool reentrancyLock;
        // Gas to cover oracle payment after we calculate the payment.
        // We make it configurable in case those operations are repriced.
        uint32 gasAfterPaymentCalculation;
    }
    Config internal sConfig;

    error Reentrant();
    error NoCorrespondingRequest();
    error NotRequestOwner();
    error OracleAlreadyRegistered(address oracle);
    error NoSuchOracle(address oracle);
    error RefundFailure();
    error InvalidConsumer(uint64 accId, address consumer);
    error IncorrectCommitment();
    error GasLimitTooBig(uint32 have, uint32 want);
    error InsufficientPayment(uint256 have, uint256 want);

    event ConfigSet(uint32 maxGasLimit, uint32 gasAfterPaymentCalculation);
    event RequestCanceled(uint256 indexed requestId);

    constructor() Ownable(_msgSender()) {}

    modifier nonReentrant() {
        if (sConfig.reentrancyLock) {
            revert Reentrant();
        }
        _;
    }

    /**
     * @inheritdoc ICoordinatorBase
     */
    function setConfig(uint32 maxGasLimit, uint32 gasAfterPaymentCalculation) external onlyOwner {
        sConfig = Config({
            maxGasLimit: maxGasLimit,
            gasAfterPaymentCalculation: gasAfterPaymentCalculation,
            reentrancyLock: false
        });
        emit ConfigSet(maxGasLimit, gasAfterPaymentCalculation);
    }

    function getConfig()
        external
        view
        returns (uint32 maxGasLimit, uint32 gasAfterPaymentCalculation)
    {
        return (sConfig.maxGasLimit, sConfig.gasAfterPaymentCalculation);
    }

    /**
     * @inheritdoc ICoordinatorBase
     */
    function getCommitment(uint256 requestId) external view returns (bytes32) {
        return sRequestIdToCommitment[requestId];
    }

    /**
     * @inheritdoc ICoordinatorBase
     */
    function cancelRequest(uint256 requestId) external {
        if (!isValidRequestId(requestId)) {
            revert NoCorrespondingRequest();
        }

        if (sRequestOwner[requestId] != msg.sender) {
            revert NotRequestOwner();
        }

        delete sRequestIdToCommitment[requestId];
        delete sRequestOwner[requestId];

        emit RequestCanceled(requestId);
    }

    function calculateGasCost(uint256 startGas) internal view returns (uint256) {
        return tx.gasprice * (sConfig.gasAfterPaymentCalculation + startGas - gasleft());
    }

    /**
     * @dev calls target address with exactly gasAmount gas and data as calldata
     * or reverts if at least gasAmount gas is not available.
     */
    function callWithExactGas(
        uint256 gasAmount,
        address target,
        bytes memory data
    ) internal returns (bool success) {
        (success, ) = target.call{gas: gasAmount}(data);
        return success;
    }

    function isValidRequestId(uint256 requestId) internal view returns (bool) {
        if (sRequestIdToCommitment[requestId] != 0) {
            return true;
        } else {
            return false;
        }
    }
}
