// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./interfaces/ITypeAndVersion.sol";
import "./interfaces/IADCSCoordinatorBase.sol";
import "./ADCSConsumerFulfill.sol";
import "./CoordinatorBase.sol";
import "./libraries/ADCS.sol";

contract ADCSCoordinator is CoordinatorBase, IADCSCoordinatorBase, ITypeAndVersion {
    uint8 public constant MAX_ORACLES = 255;

    using ADCS for ADCS.Request;

    struct Submission {
        address[] oracles; // oracles that submitted response
        mapping(address => bool) submitted;
    }

    /* requestId */
    /* submission details */
    mapping(uint256 => Submission) sSubmission;

    /* oracle */
    /* registration status */
    mapping(address => bool) private sIsOracleRegistered;

    mapping(address => uint64) private sConsumerToNonce;

    error TooManyOracles();
    error UnregisteredOracleFulfillment(address oracle);
    error InvalidJobId();
    error InvalidNumSubmission();
    error OracleAlreadySubmitted();
    error IncompatibleJobId();

    event OracleRegistered(address oracle);
    event OracleDeregistered(address oracle);
    event PrepaymentSet(address prepayment);
    event DataRequested(
        uint256 indexed requestId,
        uint256 callbackGasLimit,
        address indexed sender,
        bytes32 jobId,
        uint256 blockNumber,
        bytes data
    );
    event DataRequestFulfilledUint256(uint256 indexed requestId, uint256 response, bool success);
    event DataRequestFulfilledBool(uint256 indexed requestId, bool response, bool success);
    event DataRequestFulfilledBytes32(uint256 indexed requestId, bytes32 response, bool success);
    event DataRequestFulfilledBytes(uint256 indexed requestId, bytes response, bool success);
    event DataRequestFulfilledStringAndBool(
        uint256 indexed requestId,
        StringAndBool response,
        bool success
    );

    event DataRequestFulfilled(uint256 indexed requestId, bytes response, bool success);

    event DataSubmitted(address oracle, uint256 requestId);

    constructor() {}

    /**
     * @notice Register an oracle
     * @param oracle address of the oracle
     */
    function registerOracle(address oracle) external onlyOwner {
        if (sOracles.length >= MAX_ORACLES) {
            revert TooManyOracles();
        }

        if (sIsOracleRegistered[oracle]) {
            revert OracleAlreadyRegistered(oracle);
        }
        sOracles.push(oracle);
        sIsOracleRegistered[oracle] = true;
        emit OracleRegistered(oracle);
    }

    /**
     * @notice Deregister an oracle
     * @param oracle address of the oracle
     */
    function deregisterOracle(address oracle) external onlyOwner {
        if (!sIsOracleRegistered[oracle]) {
            revert NoSuchOracle(oracle);
        }
        delete sIsOracleRegistered[oracle];

        uint256 oraclesLength = sOracles.length;
        for (uint256 i = 0; i < oraclesLength; ++i) {
            if (sOracles[i] == oracle) {
                address last = sOracles[oraclesLength - 1];
                sOracles[i] = last;
                sOracles.pop();
                break;
            }
        }

        emit OracleDeregistered(oracle);
    }

    /**
     * @notice The type and version of this contract
     * @return Type and version string
     */
    function typeAndVersion() external pure virtual override returns (string memory) {
        return "ADCSCoordinator v0.1";
    }

    /**
     * @notice Find out whether given oracle address was registered.
     * @return true when oracle address registered, otherwise false
     */
    function isOracleRegistered(address oracle) external view returns (bool) {
        return sIsOracleRegistered[oracle];
    }

    function computeRequestId(address sender, uint64 nonce) private pure returns (uint256) {
        return uint256(keccak256(abi.encode(sender, nonce)));
    }

    function pendingRequestExists(address consumer, uint64 nonce) public view returns (bool) {
        uint256 oraclesLength = sOracles.length;
        for (uint256 i = 0; i < oraclesLength; ++i) {
            uint256 requestId = computeRequestId(consumer, nonce);
            if (isValidRequestId(requestId)) {
                return true;
            }
        }
        return false;
    }

    function increaseNonce(address consumer) private returns (uint64) {
        uint64 nonce = sConsumerToNonce[consumer] + 1;
        sConsumerToNonce[consumer] = nonce;
        return nonce;
    }

    function requestData(
        uint256 callbackGasLimit,
        ADCS.Request memory req
    ) external returns (uint256) {
        if (callbackGasLimit > sConfig.maxGasLimit) {
            revert GasLimitTooBig(callbackGasLimit, sConfig.maxGasLimit);
        }
        uint64 nonce = increaseNonce(msg.sender);
        uint256 requestId = computeRequestId(msg.sender, nonce);
        uint256 blockNumber = block.number;
        sRequestIdToCommitment[requestId] = computeCommitment(
            requestId,
            blockNumber,
            callbackGasLimit,
            msg.sender,
            req.id
        );

        sRequestOwner[requestId] = msg.sender;

        emit DataRequested(
            requestId,
            callbackGasLimit,
            msg.sender,
            req.id,
            blockNumber,
            req.buf.buf
        );

        return requestId;
    }

    function validateDataResponse(RequestCommitment memory rc, uint256 requestId) private view {
        if (!sIsOracleRegistered[msg.sender]) {
            revert UnregisteredOracleFulfillment(msg.sender);
        }

        if (sSubmission[requestId].submitted[msg.sender]) {
            revert OracleAlreadySubmitted();
        }

        bytes32 commitment = sRequestIdToCommitment[requestId];
        if (commitment == 0) {
            revert NoCorrespondingRequest();
        }

        if (
            commitment !=
            computeCommitment(requestId, rc.blockNum, rc.callbackGasLimit, rc.sender, rc.jobId)
        ) {
            revert IncorrectCommitment();
        }
    }

    function fulfill(bytes memory resp, RequestCommitment memory rc) private returns (bool) {
        // Call with explicitly the amount of callback gas requested
        // Important to not let them exhaust the gas budget and avoid oracle payment.
        // Do not allow any non-view/non-pure coordinator functions to be called
        // during the consumers callback code via reentrancyLock.
        // Note that callWithExactGas will revert if we do not have sufficient gas
        // to give the callee their requested amount.
        sConfig.reentrancyLock = true;
        (bool sent, ) = rc.sender.call(resp);
        // bool success = callWithExactGas(rc.callbackGasLimit, rc.sender, resp);
        //
        sConfig.reentrancyLock = false;
        return sent;
    }

    function cleanupAfterFulfillment(uint256 requestId) private returns (address[] memory) {
        address[] memory oracles = sSubmission[requestId].oracles;

        for (uint8 i = 0; i < oracles.length; ++i) {
            delete sSubmission[requestId].submitted[oracles[i]];
        }

        delete sSubmission[requestId];
        delete sRequestIdToCommitment[requestId];
        delete sRequestOwner[requestId];

        return oracles;
    }

    function uint256ToInt256(uint256[] memory arr) private pure returns (int256[] memory) {
        int256[] memory responses = new int256[](arr.length);
        for (uint256 i = 0; i < arr.length; i++) {
            responses[i] = int256(uint256(arr[i]));
        }
        return responses;
    }

    function computeCommitment(
        uint256 requestId,
        uint256 blockNumber,
        uint256 callbackGasLimit,
        address sender,
        bytes32 jobId
    ) internal pure returns (bytes32) {
        return keccak256(abi.encode(requestId, blockNumber, callbackGasLimit, sender, jobId));
    }

    function fulfillDataRequestUint256(
        uint256 requestId,
        uint256 response,
        RequestCommitment memory rc
    ) external nonReentrant {
        validateDataResponse(rc, requestId);
        sSubmission[requestId].submitted[msg.sender] = true;

        address[] storage oracles = sSubmission[requestId].oracles;
        oracles.push(msg.sender);
        bytes memory resp = abi.encodeWithSelector(
            ADCSConsumerFulfillUint256.rawFulfillDataRequest.selector,
            requestId,
            response
        );
        bool success = fulfill(resp, rc);
        cleanupAfterFulfillment(requestId);

        emit DataRequestFulfilledUint256(requestId, response, success);
    }

    function fulfillDataRequestBool(
        uint256 requestId,
        bool response,
        RequestCommitment memory rc
    ) external override {
        validateDataResponse(rc, requestId);
        sSubmission[requestId].submitted[msg.sender] = true;

        address[] storage oracles = sSubmission[requestId].oracles;
        oracles.push(msg.sender);
        bytes memory resp = abi.encodeWithSelector(
            ADCSConsumerFulfillBool.rawFulfillDataRequest.selector,
            requestId,
            response
        );
        bool success = fulfill(resp, rc);
        cleanupAfterFulfillment(requestId);

        emit DataRequestFulfilledBool(requestId, response, success);
    }

    function fulfillDataRequestBytes32(
        uint256 requestId,
        bytes32 response,
        RequestCommitment memory rc
    ) external override {
        validateDataResponse(rc, requestId);
        sSubmission[requestId].submitted[msg.sender] = true;

        address[] storage oracles = sSubmission[requestId].oracles;
        oracles.push(msg.sender);
        bytes memory resp = abi.encodeWithSelector(
            ADCSConsumerFulfillBytes32.rawFulfillDataRequest.selector,
            requestId,
            response
        );
        bool success = fulfill(resp, rc);
        cleanupAfterFulfillment(requestId);

        emit DataRequestFulfilledBytes32(requestId, response, success);
    }

    function fulfillDataRequestBytes(
        uint256 requestId,
        bytes memory response,
        RequestCommitment memory rc
    ) external override {
        validateDataResponse(rc, requestId);
        sSubmission[requestId].submitted[msg.sender] = true;

        address[] storage oracles = sSubmission[requestId].oracles;
        oracles.push(msg.sender);
        bytes memory resp = abi.encodeWithSelector(
            ADCSConsumerFulfillBytes.rawFulfillDataRequest.selector,
            requestId,
            response
        );
        bool success = fulfill(resp, rc);
        cleanupAfterFulfillment(requestId);

        emit DataRequestFulfilledBytes(requestId, response, success);
    }

    function fulfillDataRequestStringAndBool(
        uint256 requestId,
        StringAndBool memory response,
        RequestCommitment memory rc
    ) external override {
        validateDataResponse(rc, requestId);
        sSubmission[requestId].submitted[msg.sender] = true;

        address[] storage oracles = sSubmission[requestId].oracles;
        oracles.push(msg.sender);
        bytes memory resp = abi.encodeWithSelector(
            ADCSConsumerFulfillStringAndBool.rawFulfillDataRequest.selector,
            requestId,
            response
        );
        bool success = fulfill(resp, rc);
        cleanupAfterFulfillment(requestId);

        emit DataRequestFulfilledStringAndBool(requestId, response, success);
    }
}
