// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TokenBurner is Ownable, ReentrancyGuard {
    // Events
    event TokensBurned(address indexed burner, uint256 amount, uint256 timestamp);
    
    // Statistics
    uint256 public totalBurned;
    uint256 public burnTransactions;
    
    // Minimum burn amount
    uint256 public constant MIN_BURN_AMOUNT = 1 ether; // 1 MXM
    
    constructor() {
        totalBurned = 0;
        burnTransactions = 0;
    }
    
    // Function to burn MXM tokens
    function burn() external payable nonReentrant {
        require(msg.value >= MIN_BURN_AMOUNT, "Must burn at least 1 MXM");
        
        // Update statistics
        totalBurned += msg.value;
        burnTransactions += 1;
        
        // Emit burn event
        emit TokensBurned(msg.sender, msg.value, block.timestamp);
    }
    
    // View functions
    function getBurnStats() external view returns (uint256, uint256) {
        return (totalBurned, burnTransactions);
    }
}