// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../ADCSConsumerFulfill.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Define a struct to hold the array data
struct CoinData {
    string symbol;
    bool signal;
}

contract MockADCSConsumerArray is ADCSConsumerFulfillBytes, Ownable {
    using ADCS for ADCS.Request;

    // Store the last received response
    bytes public lastResponse;
    uint256 public lastRequestId;
    CoinData public lastDecodedData;

    event DataRequested(uint256 indexed requestId);
    event DataFulfilled(uint256 indexed requestId, string symbol, bool signal);

    constructor(address coordinator) ADCSConsumerBase(coordinator) Ownable(msg.sender) {}

    // Function to request array data
    function requestArrayData(
        bytes32 jobId,
        uint32 callbackGasLimit,
        string memory _from
    ) external onlyOwner returns (uint256 requestId) {
        bytes32 typeId = keccak256(abi.encodePacked("bytes"));
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

        // Decode the response into CoinData struct
        (string memory symbol, bool signal) = abi.decode(response, (string, bool));
        lastDecodedData = CoinData(symbol, signal);

        emit DataFulfilled(requestId, symbol, signal);
    }

    // Helper function to encode CoinData
    function encodeCoinData(
        string memory symbol,
        bool signal
    ) external pure returns (bytes memory) {
        return abi.encode(symbol, signal);
    }

    // Helper function to decode CoinData
    function decodeCoinData(
        bytes memory data
    ) external pure returns (string memory symbol, bool signal) {
        return abi.decode(data, (string, bool));
    }

    // Helper function to get the last decoded data
    function getLastDecodedData() external view returns (string memory symbol, bool signal) {
        return (lastDecodedData.symbol, lastDecodedData.signal);
    }
}
