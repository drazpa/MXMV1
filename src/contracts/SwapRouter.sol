// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SwapRouter is Ownable, ReentrancyGuard {
    // ... previous code ...

    function swap(
        address fromToken,
        address toToken,
        uint256 fromAmount,
        uint256 minOutputAmount,
        uint256 deadline
    ) external payable nonReentrant {
        require(block.timestamp <= deadline, "Swap expired");
        require(fromToken != toToken, "Same tokens");
        
        // Calculate output amount and price impact
        (uint256 outputAmount, uint256 priceImpact) = calculateOutputAmount(
            fromToken,
            toToken,
            fromAmount
        );
        require(outputAmount >= minOutputAmount, "Insufficient output");
        require(priceImpact <= 1000, "Price impact too high"); // Max 10%
        
        // Handle native token (MXM) input
        if (fromToken == address(0)) {
            // For native token input, ensure exact amount is sent
            require(msg.value == fromAmount, "Invalid native amount");
        } else {
            // For ERC20 input, ensure no native token is sent
            require(msg.value == 0, "Native token not needed");
            // Transfer ERC20 tokens to this contract
            IERC20(fromToken).transferFrom(msg.sender, address(this), fromAmount);
        }
        
        // Calculate final output after fees
        uint256 feeAmount = (outputAmount * FEE) / FEE_DENOMINATOR;
        uint256 finalOutput = outputAmount - feeAmount;
        
        // Handle output transfer
        if (toToken == address(0)) {
            // For native token output
            (bool success,) = msg.sender.call{value: finalOutput}("");
            require(success, "Native transfer failed");
        } else {
            // For ERC20 output
            IERC20(toToken).transfer(msg.sender, finalOutput);
        }
        
        emit TokenSwap(
            msg.sender,
            fromToken,
            toToken,
            fromAmount,
            finalOutput,
            feeAmount
        );
    }

    // Add gas estimation function
    function estimateGas(
        address fromToken,
        address toToken,
        uint256 fromAmount
    ) external view returns (uint256) {
        // Base gas cost for the swap
        uint256 baseGas = 100000;
        
        // Additional gas for token approvals and transfers
        if (fromToken != address(0)) {
            baseGas += 50000; // ERC20 approval + transfer
        }
        if (toToken != address(0)) {
            baseGas += 30000; // ERC20 transfer
        }
        
        return baseGas;
    }

    // Function to withdraw accumulated fees
    function withdrawFees(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            (bool success,) = msg.sender.call{value: amount}("");
            require(success, "Native withdrawal failed");
        } else {
            IERC20(token).transfer(msg.sender, amount);
        }
    }

    // Required to receive native token
    receive() external payable {}
}