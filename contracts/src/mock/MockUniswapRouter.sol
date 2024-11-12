// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockUniswapRouter {
    event SwapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] path,
        address to,
        uint deadline
    );

    function exactInputSingle(
        ExactInputSingleParams calldata params
    ) external payable returns (uint256 amountOut) {
        // Transfer tokens from sender to simulate swap
        IERC20(params.tokenIn).transferFrom(msg.sender, address(this), params.amountIn);
        IERC20(params.tokenOut).transfer(params.recipient, params.amountOut);

        return params.amountOut;
    }

    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOut;
        uint160 sqrtPriceLimitX96;
    }
}
