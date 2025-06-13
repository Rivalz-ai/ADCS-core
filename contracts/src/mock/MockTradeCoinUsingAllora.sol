// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "../ADCSConsumerFulfill.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/swap-router-contracts/contracts/interfaces/IV3SwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract MockTradeCoinUsingAllora is ADCSConsumerFulfillBool, Ownable {
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
    address public immutable USDC;
    IV3SwapRouter public swapRouter;

    constructor(
        address _coordinator,
        address _weth,
        address _usdc,
        address _swapRouter
    ) ADCSConsumerBase(_coordinator) Ownable(msg.sender) {
        WETH = _weth;
        USDC = _usdc;
        swapRouter = IV3SwapRouter(_swapRouter);
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

    function setTokenAmount(uint256 _newAmount) external onlyOwner {
        memeCoinAmount = _newAmount;
    }

    function setSwapRouter(address _swapRouter) external onlyOwner {
        swapRouter = IV3SwapRouter(_swapRouter);
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

    function fulfillDataRequest(uint256 requestId, bool response) internal virtual override {
        tradeETHCoin(requestId, response);
    }

    function tradeETHCoin(uint256 requestId, bool result) internal {
        // Find  address and decimals by name
        address tokenAddress = USDC;
        uint8 tokenDecimals = IERC20Metadata(tokenAddress).decimals();

        // Execute trade through Uniswap V3
        if (!result) {
            // sell eth for token
            IERC20(WETH).approve(address(swapRouter), wethAmountForTrade);
            swapRouter.exactInputSingle(
                IV3SwapRouter.ExactInputSingleParams({
                    tokenIn: WETH,
                    tokenOut: tokenAddress,
                    fee: 3000,
                    recipient: address(this),
                    amountIn: wethAmountForTrade,
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                })
            );

            emit TradeSuccess(requestId, wethAmountForTrade, true);
        } else {
            // buy eth for token
            // First approve router to spend our tokens
            uint256 tokenAmountInWei = memeCoinAmount * (10 ** tokenDecimals);
            IERC20(tokenAddress).approve(address(swapRouter), tokenAmountInWei);

            swapRouter.exactInputSingle(
                IV3SwapRouter.ExactInputSingleParams({
                    tokenIn: tokenAddress, //  token
                    tokenOut: WETH, // eth
                    fee: 3000, // 0.3% fee tier
                    recipient: address(this),
                    amountIn: tokenAmountInWei,
                    amountOutMinimum: 0, // Set minimum amount out to 0 (should use proper slippage in production)
                    sqrtPriceLimitX96: 0
                })
            );
            emit TradeSuccess(requestId, tokenAmountInWei, false);
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
