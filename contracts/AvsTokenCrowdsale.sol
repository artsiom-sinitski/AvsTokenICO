pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";

contract AvsTokenCrowdsale is Crowdsale, MintedCrowdsale {
    //STATE DATA

    //CONSTRUCTOR
    constructor (uint256 _rate, address _wallet, ERC20 _token)
        Crowdsale(_rate, _wallet, _token) public {
    }
}
