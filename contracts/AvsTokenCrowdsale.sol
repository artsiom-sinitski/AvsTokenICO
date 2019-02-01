pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";

contract AvsTokenCrowdsale is Crowdsale, MintedCrowdsale,
                              CappedCrowdsale, TimedCrowdsale {
    //STATE DATA

    //Track AvS token stats
    uint256 public tokenPrice = 1000000000000000; //0.001 ETH
    uint256 public tokenSupply = 1000000;
    uint256 public tokensSold = 0;
    
    //Track investor contribution amounts
    uint256 public investorMinCap = 2000000000000000;      // 0.002 ETH
    uint256 public investorMaxCap = 50000000000000000000;  // 50 ETH
    mapping (address => uint256) public contributions;

    //CONSTRUCTOR
    constructor(uint256 _rate, address _wallet, ERC20 _token,
                uint256 _cap, uint256 _openingTime, uint256 _closingTime)
        Crowdsale(_rate, _wallet, _token)
        CappedCrowdsale(_cap)
        TimedCrowdsale(_openingTime, _closingTime) public {
    }

    // GETTERS & SETTERS
    /*@dev Returns the amt contributed so far by a specific user
     *@param Address of the contributor
     *@return total user contributions up to this point in time
     */
    function getUserContribution(address _beneficiary) public view returns (uint256) {
        return contributions[_beneficiary];
    }

    // CONTRACT METHODS
    /*
    * @dev Extend parent behavior requiring purchase to respect investor min/max funding cap.
    * @param _beneficiary Token purchaser
    * @param _weiAmount Amount of wei contributed
    */
    function _preValidatePurchase(
     address _beneficiary,
     uint256 _weiAmt) internal {
         super._preValidatePurchase(_beneficiary, _weiAmt);
         uint256 prevContribution = contributions[_beneficiary];
         uint256 _newContribution = prevContribution.add(_weiAmt);
         require(_newContribution >= investorMinCap && _newContribution <= investorMaxCap);
         contributions[_beneficiary] = _newContribution;
    }
}
