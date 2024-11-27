// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../ADCSConsumerFulfill.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IPeripheryPayments.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockTradeMemeCoin is ADCSConsumerFulfillStringAndBool, Ownable {
    using ADCS for ADCS.Request;

    // Store the last received response for testing
    bytes public lastResponse;
    uint256 public lastRequestId;
    uint256 public wethAmountForTrade = 1000000000000000; // 0.001 WETH
    uint256 public memeCoinAmount = 100; // 100 memecoin

    struct MemeCoin {
        string name;
        address addr;
        uint8 decimals;
    }

    MemeCoin[] public memeCoins;

    event DataRequested(uint256 indexed requestId);
    event DataFulfilled(uint256 indexed requestId, bytes response);
    event MemecoinNotFound(string tokenName);
    event TradeSuccess(uint256 indexed requestId, uint256 amountIn, bool isBuy);

    address public immutable WETH;
    ISwapRouter public immutable swapRouter;

    constructor(
        address _coordinator,
        address _weth,
        address _swapRouter
    ) ADCSConsumerBase(_coordinator) Ownable(msg.sender) {
        WETH = _weth;
        swapRouter = ISwapRouter(_swapRouter);
    }

    function setWethAmountForTrade(uint256 amount) external onlyOwner {
        wethAmountForTrade = amount;
    }

    /**
     * @notice Add a new memecoin to the list
     * @param name The name of the memecoin
     * @param addr The contract address of the memecoin
     * @param decimals The decimals of the memecoin
     */
    function addMemeCoin(string memory name, address addr, uint8 decimals) external onlyOwner {
        memeCoins.push(MemeCoin({name: name, addr: addr, decimals: decimals}));
    }

    /**
     * @notice Get the total number of memecoins in the list
     * @return The length of the memecoins array
     */
    function getMemeCoinCount() external view returns (uint256) {
        return memeCoins.length;
    }

    /**
     * @notice Get a memecoin by index
     * @param index The index in the memecoins array
     * @return name The memecoin name
     * @return addr The memecoin contract address
     * @return decimals The decimals of the memecoin
     */
    function getMemeCoin(
        uint256 index
    ) external view returns (string memory name, address addr, uint8 decimals) {
        require(index < memeCoins.length, "Index out of bounds");
        MemeCoin memory coin = memeCoins[index];
        return (coin.name, coin.addr, coin.decimals);
    }

    // Function to request bytes data
    function requestTradeMemeCoin(
        bytes32 jobId,
        uint256 callbackGasLimit
    ) external returns (uint256 requestId) {
        bytes32 typeId = keccak256(abi.encodePacked("stringAndbool"));
        ADCS.Request memory req = buildRequest(jobId, typeId);
        requestId = COORDINATOR.requestData(callbackGasLimit, req);
        emit DataRequested(requestId);
        return requestId;
    }

    function fulfillDataRequest(
        uint256 requestId,
        StringAndBool memory response
    ) internal virtual override {
        string memory tokenName = response.name;
        bool result = response.response;
        // Find memecoin address and decimals by name
        tradeMemeCoin(requestId, tokenName, result);
    }

    function tradeMemeCoin(uint256 requestId, string memory tokenName, bool result) internal {
        // Find memecoin address and decimals by name
        address memeTokenAddress;
        uint8 tokenDecimals;
        for (uint i = 0; i < memeCoins.length; i++) {
            if (keccak256(bytes(memeCoins[i].name)) == keccak256(bytes(tokenName))) {
                memeTokenAddress = memeCoins[i].addr;
                tokenDecimals = memeCoins[i].decimals;
                break;
            }
        }
        if (memeTokenAddress == address(0)) {
            emit MemecoinNotFound(tokenName);
            return;
        }

        // Execute trade through Uniswap V3
        if (result) {
            // buy memecoin with eth
            IERC20(WETH).approve(address(swapRouter), wethAmountForTrade);
            swapRouter.exactInputSingle(
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: WETH,
                    tokenOut: memeTokenAddress,
                    fee: 3000,
                    recipient: address(this),
                    deadline: block.timestamp + 15 minutes,
                    amountIn: wethAmountForTrade,
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                })
            );

            emit TradeSuccess(requestId, wethAmountForTrade, true);
        } else {
            // sell memecoin for eth
            // First approve router to spend our tokens
            uint256 memeCoinAmountInWei = memeCoinAmount * (10 ** tokenDecimals);
            IERC20(memeTokenAddress).approve(address(swapRouter), memeCoinAmountInWei);

            swapRouter.exactInputSingle(
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: memeTokenAddress, // memecoin token
                    tokenOut: WETH, // eth
                    fee: 3000, // 0.3% fee tier
                    recipient: address(this),
                    deadline: block.timestamp + 15 minutes,
                    amountIn: memeCoinAmountInWei,
                    amountOutMinimum: 0, // Set minimum amount out to 0 (should use proper slippage in production)
                    sqrtPriceLimitX96: 0
                })
            );
            emit TradeSuccess(requestId, memeCoinAmountInWei, false);
        }
    }

    receive() external payable {}

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function withdrawToken(address token) external onlyOwner {
        IERC20(token).transfer(owner(), IERC20(token).balanceOf(address(this)));
    }
}
