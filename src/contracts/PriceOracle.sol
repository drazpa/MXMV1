// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PriceOracle is Ownable, ReentrancyGuard {
    // Events
    event PriceUpdated(uint256 price, uint256 timestamp);
    event ConversionRecorded(uint256 mxmAmount, uint256 mintAmount, uint256 timestamp);
    
    struct PricePoint {
        uint256 price;      // Price in basis points (1 MXM = X MINT)
        uint256 timestamp;  // When this price was recorded
        uint256 volume;     // Volume in MXM for this period
    }
    
    // Price history (last 24 hours, 5-minute intervals)
    PricePoint[288] public priceHistory;
    uint256 public currentIndex;
    
    // TWAP parameters
    uint256 public constant PERIOD = 5 minutes;
    uint256 public constant WINDOW = 1 hours;
    
    // Volume weighted parameters
    uint256 public totalVolume;
    uint256 public volumeWeightedPrice;
    
    constructor() {
        // Initialize with base price (1 MXM = 2 MINT)
        uint256 basePrice = 20000; // 2.0000 in basis points
        priceHistory[0] = PricePoint(basePrice, block.timestamp, 0);
    }
    
    // Record a conversion and update price
    function recordConversion(uint256 mxmAmount, uint256 mintAmount) external {
        require(mxmAmount > 0 && mintAmount > 0, "Invalid amounts");
        
        // Calculate price from this conversion (in basis points)
        uint256 conversionPrice = (mintAmount * 10000) / mxmAmount;
        
        // Update current period
        uint256 periodIndex = (block.timestamp / PERIOD) % 288;
        if (periodIndex != currentIndex) {
            // New period, rotate array
            currentIndex = periodIndex;
            priceHistory[currentIndex] = PricePoint(conversionPrice, block.timestamp, mxmAmount);
        } else {
            // Update current period
            PricePoint storage current = priceHistory[currentIndex];
            current.price = ((current.price * current.volume) + (conversionPrice * mxmAmount)) / (current.volume + mxmAmount);
            current.volume += mxmAmount;
        }
        
        // Update volume weighted price
        totalVolume += mxmAmount;
        volumeWeightedPrice = ((volumeWeightedPrice * (totalVolume - mxmAmount)) + (conversionPrice * mxmAmount)) / totalVolume;
        
        emit ConversionRecorded(mxmAmount, mintAmount, block.timestamp);
        emit PriceUpdated(conversionPrice, block.timestamp);
    }
    
    // Get current TWAP price
    function getTWAP() public view returns (uint256) {
        uint256 startPeriod = (block.timestamp - WINDOW) / PERIOD;
        uint256 endPeriod = block.timestamp / PERIOD;
        uint256 totalPrice = 0;
        uint256 count = 0;
        
        for (uint256 i = startPeriod; i <= endPeriod; i++) {
            uint256 index = i % 288;
            if (priceHistory[index].timestamp >= block.timestamp - WINDOW) {
                totalPrice += priceHistory[index].price;
                count++;
            }
        }
        
        return count > 0 ? totalPrice / count : priceHistory[currentIndex].price;
    }
    
    // Get volume weighted average price
    function getVWAP() public view returns (uint256) {
        return volumeWeightedPrice;
    }
    
    // Get latest price
    function getLatestPrice() public view returns (uint256) {
        return priceHistory[currentIndex].price;
    }
    
    // Get price with volume threshold
    function getPriceWithVolume(uint256 amount) public view returns (uint256) {
        uint256 basePrice = getTWAP();
        
        // Apply slippage based on amount
        if (amount <= 1000 ether) {
            return basePrice;
        } else if (amount <= 10000 ether) {
            return (basePrice * 9900) / 10000; // 1% slippage
        } else {
            return (basePrice * 9800) / 10000; // 2% slippage
        }
    }
}