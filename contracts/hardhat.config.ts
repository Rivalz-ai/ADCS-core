import * as dotenv from 'dotenv'
dotenv.config()

import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'
import '@nomiclabs/hardhat-solhint'
import '@nomicfoundation/hardhat-verify'
import '@nomicfoundation/hardhat-chai-matchers'

module.exports = {
  typechain: {
    outDir: './typechain',
    target: 'ethers-v6'
  },
  solidity: {
    compilers: [
      {
        version: '0.8.20'
      }
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },

  networks: {
    hardhat: {
      accounts: {
        count: 10
      },
      live: false,
      saveDeployments: false
    },
    development: {
      url: 'http://127.0.0.1:8545', // Localhost (default: none)
      live: false,
      saveDeployments: true
    },
    rivalz_test: {
      url: process.env.RIVALZ_TESTNET_PROVIDER,
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.2,
      verify: {
        etherscan: {
          apiUrl: 'https://api.routescan.io/v2/network/testnet/evm/168587773/etherscan',
          apiKey: process.env.EXPLORER_API_KEY
        }
      }
    },
    matic_test: {
      url: 'https://rpc.ankr.com/polygon_amoy',
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.2,
      saveDeployments: true,
      verify: {
        etherscan: {
          apiUrl: 'https://api-testnet.polygonscan.com/api',
          apiKey: process.env.EXPLORER_API_KEY
        }
      }
    },
    polygon: {
      url: process.env.POLOGON_PROVIDER,
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.3,
      saveDeployments: true,
      verify: {
        etherscan: {
          apiUrl: 'https://api.polygonscan.com/api',
          apiKey: process.env.EXPLORER_API_KEY
        }
      }
    },
    rivalz2_test: {
      url: 'https://rivalz2.rpc.caldera.xyz/infra-partner-http',
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.2,
      verify: {
        etherscan: {
          apiUrl: 'https://rivalz2.explorer.caldera.xyz/api',
          apiKey: process.env.EXPLORER_API_KEY
        }
      }
    },
    arbitrum_test: {
      url: 'https://sepolia-rollup.arbitrum.io/rpc',
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.2,
      verify: {
        etherscan: {
          apiUrl: 'https://sepolia.arbiscan.io/api',
          apiKey: process.env.EXPLORER_API_KEY
        }
      }
    },
    arbitrum: {
      url: 'https://arb1.arbitrum.io/rpc',
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.2,
      verify: {
        etherscan: {
          apiUrl: 'https://arb1.arbitrum.io/rpc/api',
          apiKey: process.env.EXPLORER_API_KEY
        }
      }
    },
    mainnet: {
      url: 'https://rpc.ankr.com/eth/dc3359a3d6c4f6866d0e59e41b886d8806cba7197232edf7412c79644595b948',
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.1,
      verify: {
        etherscan: {
          apiUrl: 'https://api.etherscan.io/api',
          apiKey: process.env.EXPLORER_API_KEY
        }
      }
    }
  },

  paths: {
    sources: './src',
    tests: './test',
    cache: './build/cache',
    artifacts: './build/artifacts',
    deployments: './deployments'
  },

  verify: {
    etherscan: {
      apiKey: process.env.EXPLORER_API_KEY
    }
  },

  etherscan: {
    apiKey: {
      blast_sepolia: process.env.EXPLORER_API_KEY,
      polygon: process.env.EXPLORER_API_KEY,
      rivalz2_test: process.env.EXPLORER_API_KEY,
      mainnet: process.env.EXPLORER_API_KEY
    },
    customChains: [
      {
        network: 'rivalz2_test',
        chainId: 6966,
        urls: {
          apiURL: 'https://rivalz2.explorer.caldera.xyz/api',
          browserURL: 'https://rivalz2.explorer.caldera.xyz'
        }
      },
      {
        network: 'blast_sepolia',
        chainId: 168587773,
        urls: {
          apiURL: 'https://api.routescan.io/v2/network/testnet/evm/168587773/etherscan',
          browserURL: 'https://sepolia.blastscan.io'
        }
      }
    ]
  },
  namedAccounts: {
    // migrations
    deployer: {
      default: 0
    }
  }
}
