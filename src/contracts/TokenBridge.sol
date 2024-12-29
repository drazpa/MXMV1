// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenBridge is ReentrancyGuard, Ownable {
    // Events
    event BridgeInitiated(
        address indexed token,
        address indexed from,
        uint256 amount,
        uint256 nonce,
        uint256 timestamp
    );
    event TokenAdded(address indexed token, uint256 minAmount);
    event TokenRemoved(address indexed token);
    
    // State variables
    uint256 public bridgeFee = 50; // 0.5%
    uint256 public constant MIN_NATIVE_AMOUNT = 0.1 ether;
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public minTokenAmount;
    uint256 public nonce;
    
    constructor() {
        // Add native token support by default
        supportedTokens[address(0)] = true;
    }
    
    // Token management functions
    function addToken(address token, uint256 minAmount) external onlyOwner {
        require(token != address(0), "Cannot modify native token");
        require(!supportedTokens[token], "Token already supported");
        require(minAmount > 0, "Min amount must be positive");
        
        supportedTokens[token] = true;
        minTokenAmount[token] = minAmount;
        emit TokenAdded(token, minAmount);
    }
    
    function removeToken(address token) external onlyOwner {
        require(token != address(0), "Cannot remove native token");
        require(supportedTokens[token], "Token not supported");
        
        supportedTokens[token] = false;
        delete minTokenAmount[token];
        emit TokenRemoved(token);
    }
    
    // Bridge function
    function bridgeTokens(address token, uint256 amount) external payable nonReentrant {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Amount must be positive");
        
        // Validate minimum amounts
        if (token == address(0)) {
            require(msg.value >= MIN_NATIVE_AMOUNT, "Below minimum native amount");
            require(msg.value == amount, "Invalid native amount");
        } else {
            require(amount >= minTokenAmount[token], "Below minimum token amount");
            // Transfer tokens to bridge
            IERC20(token).transferFrom(msg.sender, address(this), amount);
        }
        
        // Calculate fee
        uint256 fee = (amount * bridgeFee) / 10000;
        uint256 netAmount = amount - fee;
        
        // Emit bridge event
        emit BridgeInitiated(
            token,
            msg.sender,
            netAmount,
            nonce++,
            block.timestamp
        );
    }
    
    // View functions
    function isTokenSupported(address token) external view returns (bool) {
        return supportedTokens[token];
    }
    
    function getMinAmount(address token) external view returns (uint256) {
        if (token == address(0)) return MIN_NATIVE_AMOUNT;
        return minTokenAmount[token];
    }
    
    // Admin functions
    function updateBridgeFee(uint256 newFee) external onlyOwner {
        require(newFee <= 500, "Fee too high"); // Max 5%
        bridgeFee = newFee;
    }
    
    function updateMinTokenAmount(address token, uint256 newAmount) external onlyOwner {
        require(token != address(0), "Cannot modify native token");
        require(supportedTokens[token], "Token not supported");
        require(newAmount > 0, "Min amount must be positive");
        minTokenAmount[token] = newAmount;
    }
    
    // Emergency withdrawal
    function withdrawToken(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            (bool success,) = msg.sender.call{value: amount}("");
            require(success, "Native withdrawal failed");
        } else {
            IERC20(token).transfer(msg.sender, amount);
        }
    }
    
    receive() external payable {}
}