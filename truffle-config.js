//require('babel-register');
/*require('babel-register')({
  ignore: /node_modules\/(?!zeppelin-solidity\/test\/helpers)/
}); */
//require('babel-polyfill');
//require('dotenv').config();
//const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // eslint-disable-line camelcase
    } /*,
    ganache: {
      host: 'localhost',
      port: 7545,
      network_id: '*' // eslint-disable-line camelcase
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://ropsten.infura.io/${process.env.INFURA_API_KEY}`
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 3
    } */
  },
  compilers: {
    solc: { // specify a custom compiler version here, default is the latest installed
      version: "0.4.24",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : {
      currency: 'CHF',
      gasPrice: 21
    }
  }
};
