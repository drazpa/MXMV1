// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MINTToken is ERC20, Ownable, ReentrancyGuard {
    // Events
    event TokensMinted(address indexed buyer, uint256 mxmAmount, uint256 mintAmount);
    event RateUpdated(uint256 newRate);
    
    // Rate: 1 MXM = X MINT tokens
    uint256 public mintRate;
    
    // Minimum purchase amount (0.1 MXM)
    uint256 public constant MIN_PURCHASE = 100000000000000000; // 0.1 ether
    
    constructor() ERC20("MINT Token", "MINT") {
        mintRate = 2; // 1 MXM = 2 MINT tokens initially
    }
    
    // Function to mint MINT tokens with MXM
    function mintTokens() external payable nonReentrant {
        require(msg.value >= MIN_PURCHASE, "Must send at least 0.1 MXM");
        
        // Calculate MINT tokens to mint
        uint256 mintAmount = msg.value * mintRate;
        
        // Mint tokens to buyer
        _mint(msg.sender, mintAmount);
        
        emit TokensMinted(msg.sender, msg.value, mintAmount);
    }
    
    // Update mint rate (only owner)
    function setMintRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate must be positive");
        mintRate = newRate;
        emit RateUpdated(newRate);
    }
    
    // Withdraw accumulated MXM (only owner)
    function withdrawMXM() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No MXM to withdraw");
        
        (bool success,) = msg.sender.call{value: balance}("");
        require(success, "MXM withdrawal failed");
    }
    
    // Required to receive MXM
    receive() external payable {}
}