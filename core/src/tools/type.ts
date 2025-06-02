export interface IAccount {
  account: string
  tokenId: number
}
export interface IResultBaronUpdate {
  spoilTx: string
  mythicTx: string
  account: string
  tokenId: number
}

export enum QuickNodeChain {
  ARBITRUM_MAINNET = 'arbitrum-mainnet',
  ARBITRUM_SEPOLIA = 'arbitrum-sepolia',
  AVALANCHE_FUJI = 'avalanche-fuji',
  AVALANCHE_MAINNET = 'avalanche-mainnet',
  B3_MAINNET = 'b3-mainnet',
  B3_SEPOLIA = 'b3-sepolia',
  BASE_MAINNET = 'base-mainnet',
  BASE_SEPOLIA = 'base-sepolia',
  BERA_MAINNET = 'bera-mainnet',
  BERA_BARTIO = 'bera-bartio',
  BITCOIN_MAINNET = 'bitcoin-mainnet',
  BLAST_MAINNET = 'blast-mainnet',
  BLAST_SEPOLIA = 'blast-sepolia',
  BNB_MAINNET = 'bnbchain-mainnet',
  BNB_TESTNET = 'bnbchain-testnet',
  CELO_MAINNET = 'celo-mainnet',
  CYBER_MAINNET = 'cyber-mainnet',
  CYBER_SEPOLIA = 'cyber-sepolia',
  ETHEREUM_HOLESKY = 'ethereum-holesky',
  ETHEREUM_MAINNET = 'ethereum-mainnet',
  ETHEREUM_SEPOLIA = 'ethereum-sepolia',
  FANTOM_MAINNET = 'fantom-mainnet',
  FRAXTAL_MAINNET = 'fraxtal-mainnet',
  GNOSIS_MAINNET = 'gnosis-mainnet',
  KAIA_MAINNET = 'kaia-mainnet',
  KAIA_TESTNET = 'kaia-testnet',
  IMX_MAINNET = 'imx-mainnet',
  IMX_TESTNET = 'imx-testnet',
  INK_MAINNET = 'ink-mainnet',
  INK_SEPOLIA = 'ink-sepolia',
  MANTLE_MAINNET = 'mantle-mainnet',
  MANTLE_SEPOLIA = 'mantle-sepolia',
  MODE_MAINNET = 'mode-mainnet',
  MORPH_HOLESKY = 'morph-holesky',
  NOVA_MAINNET = 'nova-mainnet',
  OPTIMISM_MAINNET = 'optimism-mainnet',
  OPTIMISM_SEPOLIA = 'optimism-sepolia',
  OMNI_OMEGA = 'omni-omega',
  POLYGON_MAINNET = 'polygon-mainnet',
  POLYGON_AMOY = 'polygon-amoy',
  RACE_MAINNET = 'race-mainnet',
  RACE_TESTNET = 'race-testnet',
  REDSTONE_MAINNET = 'redstone-mainnet',
  SCROLL_MAINNET = 'scroll-mainnet',
  SCROLL_TESTNET = 'scroll-testnet',
  SOLANA_DEVNET = 'solana-devnet',
  SOLANA_MAINNET = 'solana-mainnet',
  SOLANA_TESTNET = 'solana-testnet',
  STORY_TESTNET = 'story-testnet',
  TRON_MAINNET = 'tron-mainnet',
  XAI_MAINNET = 'xai-mainnet',
  XAI_SEPOLIA = 'xai-sepolia',
  ZKEVM_MAINNET = 'zkevm-mainnet',
  ZKSYNC_MAINNET = 'zksync-mainnet',
  ZKSYNC_SEPOLIA = 'zksync-sepolia',
  ZORA_MAINNET = 'zora-mainnet',
  MONAD_TESTNET = 'monad-testnet',
  SEI = 'sei-mainnet'
}
