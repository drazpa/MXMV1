// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract WalletConverter is Ownable, ReentrancyGuard, Pausable {
    // Events
    event TokensConverted(
        address indexed user,
        uint256 mxmAmount,
        uint256 mintAmount,
        bool isMXMtoMINT,
        uint256 timestamp
    );
    event RateUpdated(uint256 oldRate, uint256 newRate, uint256 timestamp);
    event LiquidityProviderUpdated(address oldProvider, address newProvider);
    event MinimumAmountUpdated(uint256 oldAmount, uint256 newAmount);
    
    // State variables
    uint256 public conversionRate;
    uint256 public minConversionAmount;
    IERC20 public immutable mintToken;
    address public liquidityProvider;
    
    // Constants
    uint256 public constant MAX_RATE = 1000; // Maximum 1000:1 ratio
    
    constructor(
        address _mintToken,
        address _liquidityProvider,
        uint256 _initialRate,
        uint256 _minAmount
    ) {
        require(_mintToken != address(0), "Invalid MINT token");
        require(_liquidityProvider != address(0), "Invalid provider");
        require(_initialRate > 0 && _initialRate <= MAX_RATE, "Invalid rate");
        require(_minAmount > 0, "Invalid min amount");
        
        mintToken = IERC20(_mintToken);
        liquidityProvider = _liquidityProvider;
        conversionRate = _initialRate;
        minConversionAmount = _minAmount;
    }
    
    // Convert MXM to MINT
    function convertMXMtoMINT() external payable nonReentrant whenNotPaused {
        require(msg.value >= minConversionAmount, "Below minimum amount");
        
        uint256 mintAmount = msg.value * conversionRate;
        require(
            mintToken.balanceOf(liquidityProvider) >= mintAmount,
            "Insufficient MINT liquidity"
        );
        
        // Transfer MINT tokens from liquidity provider
        require(
            mintToken.transferFrom(liquidityProvider, msg.sender, mintAmount),
            "MINT transfer failed"
        );
        
        // Transfer MXM to liquidity provider
        (bool success,) = liquidityProvider.call{value: msg.value}("");
        require(success, "MXM transfer failed");
        
        emit TokensConverted(
            msg.sender,
            msg.value,
            mintAmount,
            true,
            block.timestamp
        );
    }
    
    // Convert MINT to MXM
    function convertMINTtoMXM(uint256 mintAmount) external nonReentrant whenNotPaused {
        require(mintAmount >= minConversionAmount, "Below minimum amount");
        
        uint256 mxmAmount = mintAmount / conversionRate;
        require(
            address(liquidityProvider).balance >= mxmAmount,
            "Insufficient MXM liquidity"
        );
        
        // Transfer MINT tokens to liquidity provider
        require(
            mintToken.transferFrom(msg.sender, liquidityProvider, mintAmount),
            "MINT transfer failed"
        );
        
        // Transfer MXM to user
        (bool success,) = msg.sender.call{value: mxmAmount}("");
        require(success, "MXM transfer failed");
        
        emit TokensConverted(
            msg.sender,
            mxmAmount,
            mintAmount,
            false,
            block.timestamp
        );
    }
    
    // Admin functions
    function updateRate(uint256 newRate) external onlyOwner {
        require(newRate > 0 && newRate <= MAX_RATE, "Invalid rate");
        uint256 oldRate = conversionRate;
        conversionRate = newRate;
        emit RateUpdated(oldRate, newRate, block.timestamp);
    }
    
    function updateLiquidityProvider(address newProvider) external onlyOwner {
        require(newProvider != address(0), "Invalid provider");
        address oldProvider = liquidityProvider;
        liquidityProvider = newProvider;
        emit LiquidityProviderUpdated(oldProvider, newProvider);
    }
    
    function updateMinimumAmount(uint256 newAmount) external onlyOwner {
        require(newAmount > 0, "Invalid amount");
        uint256 oldAmount = minConversionAmount;
        minConversionAmount = newAmount;
        emit MinimumAmountUpdated(oldAmount, newAmount);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Emergency withdrawal
    function emergencyWithdraw(address token) external onlyOwner {
        if (token == address(0)) {
            uint256 balance = address(this).balance;
            require(balance > 0, "No MXM to withdraw");
            (bool success,) = msg.sender.call{value: balance}("");
            require(success, "MXM withdrawal failed");
        } else {
            IERC20 tokenContract = IERC20(token);
            uint256 balance = tokenContract.balanceOf(address(this));
            require(balance > 0, "No tokens to withdraw");
            require(
                tokenContract.transfer(msg.sender, balance),
                "Token withdrawal failed"
            );
        }
    }
    
    receive() external payable {}
}