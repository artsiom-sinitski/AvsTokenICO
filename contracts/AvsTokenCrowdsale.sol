pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";

contract AvsTokenCrowdsale is Crowdsale, MintedCrowdsale, CappedCrowdsale {
    //STATE DATA
    //Track investor contribution amounts
    uint256 public investorMinCap = 2000000000000000;
    uint256 public investorMaxCap = 50000000000000000000;
    mapping (address => uint256) public contributions;


    //CONSTRUCTOR
    constructor (uint256 _rate, address _wallet, ERC20 _token, uint256 _cap)
        Crowdsale(_rate, _wallet, _token)
        CappedCrowdsale(_cap) public {
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
         uint256 _newContribution = prevContribution  + _weiAmt;
         require(_newContribution >= investorMinCap && _newContribution <= investorMaxCap);
         contributions[_beneficiary] = _newContribution;
    }
}
