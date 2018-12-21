App = {
    web3Provider: null,
    contracts: {},

    init: function() {
        console.log("App initialized.");
        return App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        console.log("IF branch: ", web3);
          } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        console.log("else branch: ", web3);
          }
          return App.initContracts();
    },

    initContracts: function() {
        $.getJSON("AvsTokenCrowdsale.json", function(avsTokenCrowdsale) {
            App.contracts.AvsTokenCrowdsale = TruffleContract(avsTokenCrowdsale);
        console.log("avsTokenCrowd: ", avsTokenCrowdsale);
            App.contracts.AvsTokenCrowdsale.setProvider(App.web3Provider);
        // web3.version.getNetwork(function(err, res) {console.log(res); });
            App.contracts.AvsTokenCrowdsale.deployed().then(function(avsTokenCrowdsale) {
                console.log("Avs Token Crowdsale address:", avsTokenCrowdsale.address);
            });
        }).done(function() {
            $.getJSON("AvsToken.json", function(avsToken) {
              App.contracts.AvsToken = TruffleContract(avsToken);
              App.contracts.AvsToken.setProvider(App.web3Provider);
              App.contracts.AvsToken.deployed().then(function(avsToken) {
                console.log("AvS Token Address:", avsToken.address);
              });
      
              //App.listenForEvents();
              //return App.render();
            });
        });
    }
}

$(function() {
    $(window).load(function() {
        App.init();
    })
});