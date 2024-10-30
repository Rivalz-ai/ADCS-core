// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../ADCSConsumerFulfill.sol";
import "../interfaces/IAlchemySmartAccount.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockADCSConsumer is
    ADCSConsumerFulfillUint256,
    ADCSConsumerFulfillBool,
    ADCSConsumerFulfillBytes32,
    ADCSConsumerFulfillBytes,
    ADCSConsumerFulfillStringAndBool,
    Ownable
{
    using ADCS for ADCS.Request;
    uint256 public lastUint256;
    bool public lastBool;
    bytes32 public lastBytes32;
    bytes public lastBytes;

    StringAndBool public lastestMemeCoin;

    IAlchemySmartAccount public alchemySmartAccount;
    ISwapRouter public uniswapRouter;

    event DataRequestedUint256(uint256 indexed requestId);
    event DataRequestedBool(uint256 indexed requestId);
    event DataRequestedBytes32(uint256 indexed requestId);
    event DataRequestedBytes(uint256 indexed requestId);
    event DataRequestedStringAndBool(uint256 indexed requestId);
    event TradeExecuted(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);

    constructor(
        address _coordinator,
        address _alchemySmartAccount,
        address _uniswapRouter
    ) ADCSConsumerBase(_coordinator) Ownable(_msgSender()) {
        alchemySmartAccount = IAlchemySmartAccount(_alchemySmartAccount);
        uniswapRouter = ISwapRouter(_uniswapRouter);
    }

    function requestUint256Data(
        uint32 _callbackGasLimit,
        bytes32 _jobId,
        string memory _from,
        string memory _to
    ) external returns (uint256 requestId) {
        bytes32 typeId = keccak256(abi.encodePacked("uint256"));
        ADCS.Request memory req = buildRequest(_jobId, typeId);
        req.add("from", _from);
        req.add("to", _to);
        requestId = COORDINATOR.requestData(_callbackGasLimit, req);
        emit DataRequestedUint256(requestId);
    }

    function requestBoolData(
        uint32 _callbackGasLimit,
        bytes32 _jobId,
        string memory _from
    ) external returns (uint256 requestId) {
        bytes32 typeId = keccak256(abi.encodePacked("bool"));
        ADCS.Request memory req = buildRequest(_jobId, typeId);
        req.add("from", _from);
        requestId = COORDINATOR.requestData(_callbackGasLimit, req);
        emit DataRequestedBool(requestId);
    }

    function requestBytes32Data(
        uint32 _callbackGasLimit,
        bytes32 _jobId,
        string memory _from
    ) external returns (uint256 requestId) {
        ADCS.Request memory req = buildRequest(_jobId, keccak256(abi.encodePacked("bytes32")));
        req.add("from", _from);
        requestId = COORDINATOR.requestData(_callbackGasLimit, req);
        emit DataRequestedBytes32(requestId);
    }

    function requestMemeData(
        uint32 _callbackGasLimit,
        bytes32 _jobId
    ) external returns (uint256 requestId) {
        ADCS.Request memory req = buildRequest(
            _jobId,
            keccak256(abi.encodePacked("stringAndbool"))
        );
        requestId = COORDINATOR.requestData(_callbackGasLimit, req);
        emit DataRequestedBytes(requestId);
    }

    function requestBytesData(
        uint32 _callbackGasLimit,
        bytes32 _jobId,
        string memory _from
    ) external returns (uint256 requestId) {
        ADCS.Request memory req = buildRequest(_jobId, keccak256(abi.encodePacked("bytes")));
        req.add("from", _from);
        requestId = COORDINATOR.requestData(_callbackGasLimit, req);
        emit DataRequestedBytes(requestId);
    }

    function fulfillDataRequest(uint256, uint256 response) internal virtual override {
        lastUint256 = response;
    }

    function fulfillDataRequest(uint256, bool response) internal virtual override {
        lastBool = response;
    }

    function fulfillDataRequest(uint256, bytes32 response) internal virtual override {
        lastBytes32 = response;
    }

    function fulfillDataRequest(uint256, bytes memory response) internal virtual override {
        lastBytes = response;
    }

    function fulfillDataRequest(uint256, StringAndBool memory response) internal virtual override {
        lastestMemeCoin = response;

        // Example: Automatically execute a trade based on the received meme coin data
        if (response.response) {
            // Assuming boolValue indicates whether to buy or sell
            // This is a simplified example. In a real-world scenario, you'd need more complex logic
            // and proper error handling.
            address wethAddress = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; // Mainnet WETH address
            address memeTokenAddress = 0x1234567890123456789012345678901234567890; // Replace with actual meme token address
            uint256 amountIn = 0.1 ether; // Example amount

            executeTradeThroughSmartAccount(
                wethAddress,
                memeTokenAddress,
                amountIn,
                0, // Set a proper minimum amount out in a real scenario
                3000 // 0.3% fee tier
            );
        }
    }

    function executeTradeThroughSmartAccount(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMinimum,
        uint24 fee
    ) public onlyOwner {
        bytes memory swapCalldata = abi.encodeWithSelector(
            ISwapRouter.exactInputSingle.selector,
            ISwapRouter.ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: fee,
                recipient: address(alchemySmartAccount),
                deadline: block.timestamp + 15 minutes,
                amountIn: amountIn,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            })
        );

        alchemySmartAccount.execute(address(uniswapRouter), swapCalldata);

        emit TradeExecuted(tokenIn, tokenOut, amountIn, amountOutMinimum);
    }

    function executeTradeOnUniswap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMinimum,
        uint24 fee
    ) external returns (uint256 amountOut) {
        require(
            msg.sender == address(alchemySmartAccount),
            "Only Alchemy Smart Account can execute trades"
        );

        // Approve Uniswap router to spend tokens
        IERC20(tokenIn).approve(address(uniswapRouter), amountIn);

        // Prepare the swap parameters
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: fee,
            recipient: address(this),
            deadline: block.timestamp + 15 minutes,
            amountIn: amountIn,
            amountOutMinimum: amountOutMinimum,
            sqrtPriceLimitX96: 0
        });

        // Execute the swap
        amountOut = uniswapRouter.exactInputSingle(params);

        emit TradeExecuted(tokenIn, tokenOut, amountIn, amountOut);

        return amountOut;
    }

    function setAlchemySmartAccount(address _alchemySmartAccount) external onlyOwner {
        alchemySmartAccount = IAlchemySmartAccount(_alchemySmartAccount);
    }

    function setUniswapRouter(address _uniswapRouter) external onlyOwner {
        uniswapRouter = ISwapRouter(_uniswapRouter);
    }

    function createApprovalCalldata(
        address token,
        uint256 amount
    ) public view returns (bytes memory) {
        return abi.encodeWithSelector(IERC20.approve.selector, address(uniswapRouter), amount);
    }

    function approveUniswapRouter(address token, uint256 amount) public onlyOwner {
        bytes memory approvalCalldata = createApprovalCalldata(token, amount);
        alchemySmartAccount.execute(token, approvalCalldata);
    }

    function approveAndTrade(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMinimum,
        uint24 fee
    ) external onlyOwner {
        // First, approve the Uniswap router to spend tokens
        approveUniswapRouter(tokenIn, amountIn);

        // Then, execute the trade
        executeTradeThroughSmartAccount(tokenIn, tokenOut, amountIn, amountOutMinimum, fee);
    }
}
