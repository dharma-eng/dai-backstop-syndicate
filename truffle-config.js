var Web3 = require("web3");

module.exports = {
  networks: {
    development: {
      provider: new Web3("ws://localhost:8545"),
      network_id: "*"
    },
    coverage: {
      provider: new Web3("ws://localhost:8555"),
      network_id: "*"
    },
    ganache: {
      network_id: 127001,
      host: "127.0.0.1",
      port: 8545
    }
  },
  compilers: {
    solc: {
      version: "0.5.16",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  mocha: {
    enableTimeouts: false
  },
  plugins: ["solidity-coverage"]
};
