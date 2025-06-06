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
          apiUrl: 'https://api-sepolia.arbiscan.io/api',
          apiKey: process.env.ARBITRUM_API_KEY
        }
      }
    },
    arbitrum: {
      url: 'https://arb1.arbitrum.io/rpc',
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.2,
      verify: {
        etherscan: {
          apiUrl: 'https://api.arbiscan.io/api',
          apiKey: process.env.ARBITRUM_API_KEY
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
    },
    base: {
      url: 'https://rpc.ankr.com/base/dc3359a3d6c4f6866d0e59e41b886d8806cba7197232edf7412c79644595b948',
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.1,
      verify: {
        etherscan: {
          apiUrl: 'https://api.basescan.org/api',
          apiKey: process.env.EXPLORER_API_KEY
        }
      }
    },
    bsc: {
      url: 'https://bsc-mainnet.public.blastapi.io',
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.1,
      verify: {
        etherscan: {
          apiUrl: 'https://api.bscscan.com/api',
          apiKey: 'UJWJCKIXM87H412E5GSZPC487D6YK2ZEMP'
        }
      }
    },
    polygon: {
      url: 'https://rpc.ankr.com/polygon/dc3359a3d6c4f6866d0e59e41b886d8806cba7197232edf7412c79644595b948',
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.1,
      verify: {
        etherscan: {
          apiUrl: 'https://api.polygonscan.com/api',
          apiKey: 'FKBNQ1Z96FHZEEURN2QYS4S685FGN692JG'
        }
      }
    },
    avalanche: {
      url: 'https://avalanche-c-chain-rpc.publicnode.com',
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.1,
      verify: {
        etherscan: {
          apiUrl: 'https://api.snowtrace.io/api',
          apiKey: 'abc'
        }
      }
    },
    berachain: {
      url: 'https://berachain-rpc.publicnode.com',
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.1,
      verify: {
        etherscan: {
          apiUrl: 'https://api.berascan.com/api',
          apiKey: 'M15PPEK29J855G5KPF1ZZB4GS1PTPQZ1IP'
        }
      }
    },
    sonic: {
      url: 'https://rpc.soniclabs.com',
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.1,
      verify: {
        etherscan: {
          apiUrl: 'https://api.sonicscan.org/api',
          apiKey: '6I4PQHIHD2NYEHKZ5WBF25VYVK2UJZNNQ9'
        }
      }
    },
    optimism: {
      url: 'https://rpc.ankr.com/optimism/dc3359a3d6c4f6866d0e59e41b886d8806cba7197232edf7412c79644595b948',
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.1,
      verify: {
        etherscan: {
          apiUrl: 'https://api-optimistic.etherscan.io/api',
          apiKey: 'KHNQNR2WTC5AVZ1TTPMIACYURK574UQ8QZ'
        }
      }
    },
    abstract: {
      url: 'https://api.mainnet.abs.xyz',
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.1,
      verify: {
        etherscan: {
          apiUrl: 'https://api.basescan.org/api',
          apiKey: process.env.EXPLORER_API_KEY
        }
      }
    },
    mega_eth_test: {
      url: 'https://carrot.megaeth.com/rpc',
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.1,
      verify: {
        etherscan: {
          apiUrl: 'https://api.basescan.org/api',
          apiKey: process.env.EXPLORER_API_KEY
        }
      }
    },
    monah_test: {
      url: 'https://testnet-rpc.monad.xyz',
      accounts: [process.env.TESTNET_DEPLOYER],
      gasMultiplier: 1.1,
      verify: {
        etherscan: {
          apiUrl: 'https://api.monah.xyz/api',
          apiKey: process.env.EXPLORER_API_KEY
        }
      }
    }
  },
  sourcify: {
    enabled: true,
    apiUrl: 'https://sourcify-api-monad.blockvision.org',
    browserUrl: 'https://testnet.monadexplorer.com'
  },

  paths: {
    sources: './src',
    tests: './test',
    cache: './build/cache',
    artifacts: './build/artifacts',
    deployments: './deployments'
  },
  etherscan: {
    enabled: false,
    apiKey: {
      blast_sepolia: process.env.EXPLORER_API_KEY,
      polygon: 'FKBNQ1Z96FHZEEURN2QYS4S685FGN692JG',
      rivalz2_test: process.env.EXPLORER_API_KEY,
      arbitrum_test: process.env.ARBITRUM_API_KEY,
      mainnet: process.env.EXPLORER_API_KEY,
      arbitrum: process.env.ARBITRUM_API_KEY,
      base: process.env.BASE_API_KEY,
      avalanche: 'https://api.snowtrace.io/api',
      berachain: 'M15PPEK29J855G5KPF1ZZB4GS1PTPQZ1IP',
      bsc: 'UJWJCKIXM87H412E5GSZPC487D6YK2ZEMP',
      sonic: '6I4PQHIHD2NYEHKZ5WBF25VYVK2UJZNNQ9',
      optimism: 'KHNQNR2WTC5AVZ1TTPMIACYURK574UQ8QZ'
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
        network: 'arbitrum_test',
        chainId: 421614,
        urls: {
          apiURL: 'https://api-sepolia.arbiscan.io/api',
          browserURL: 'https://sepolia.arbiscan.io'
        }
      },
      {
        network: 'blast_sepolia',
        chainId: 168587773,
        urls: {
          apiURL: 'https://api.routescan.io/v2/network/testnet/evm/168587773/etherscan',
          browserURL: 'https://sepolia.blastscan.io'
        }
      },
      {
        network: 'arbitrum',
        chainId: 42161,
        urls: {
          apiURL: 'https://api.arbiscan.io/api',
          browserURL: 'https://arbiscan.io'
        }
      },
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org'
        }
      },
      {
        network: 'berachain',
        chainId: 80094,
        urls: {
          apiURL: 'https://api.berascan.com/api',
          browserURL: 'https://api.berascan.com'
        }
      },
      {
        network: 'optimism',
        chainId: 10,
        urls: {
          apiURL: 'https://api-optimistic.etherscan.io/api',
          browserURL: 'https://optimistic.etherscan.io/'
        }
      },
      ,
      {
        network: 'sonic',
        chainId: 146,
        urls: {
          apiURL: 'https://api.sonicscan.org/api',
          browserURL: 'https://sonicscan.org'
        }
      },
      {
        network: 'polygon',
        chainId: 137,
        urls: {
          apiURL: 'https://api.polygonscan.com/api',
          browserURL: 'https://polygonscan.com'
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
