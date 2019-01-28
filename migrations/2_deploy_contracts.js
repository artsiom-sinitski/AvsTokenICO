const avsToken = artifacts.require("./AvsToken.sol");
const avsTokenCrowdsale = artifacts.require("./AvsTokenCrowdsale.sol");

const ether = (n) => new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'));
const duration = {
    seconds: function(val) { return val; },
    minutes: function(val) { return val * this.seconds(60); },
    hours: function(val) { return val * this.minutes(60); },
    days: function(val) { return val * this.hours(24); },
    weeks: function(val) { return val * this.days(7); },
    years: function(val) { return val * this.days(365); }
};

module.exports = async function(deployer, network, accounts) {
    const _name = "AvS Token";
    const _symbol = "AvS";
    const _decimals = 18;

    await deployer.deploy(avsToken, _name, _symbol, _decimals);
    const deployedToken = await avsToken.deployed();

    const latestTime = (new Date).getTime();

    const _rate = 500;
    const _wallet = accounts[0];
    const _token = deployedToken.address;
    const _openingTime = latestTime + duration.minutes(1);
    const _closingTime = _openingTime + duration.weeks(1);
    const _cap = ether(100);

    await deployer.deploy(avsTokenCrowdsale,
                    _rate,
                    _wallet,
                    _token,
                    _cap,
                    _openingTime,
                    _closingTime);
            
    return true;
};