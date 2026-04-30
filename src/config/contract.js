/**
 * DHS Smart Contract Configuration
 * Soroban contract deployed on Stellar Testnet
 */

// Contract ID on Stellar Testnet
export const CONTRACT_ID = 'CCB5YFXGTLY2UZXTP5SDJK3WI2NREM5QKG22SAZHPNGEYIPUDUAZIWDF';

// Network configuration
export const NETWORK_CONFIG = {
  network: 'testnet',
  rpcUrl: 'https://soroban-testnet.stellar.org:443',
  networkPassphrase: 'Test SDF Network ; September 2015',
};

// Contract function names
export const CONTRACT_FUNCTIONS = {
  ADD_RECORD: 'add_record',
  GET_RECORDS: 'get_records',
  GET_RECORD_BY_INDEX: 'get_record_by_index',
  GET_RECORD_COUNT: 'get_record_count',
  GET_BALANCE: 'get_balance',
  TRANSFER: 'transfer',
  GET_TOTAL_RECORDS: 'get_total_records',
};

// Token configuration
export const TOKEN_CONFIG = {
  decimals: 7,
  uploadReward: 10, // DHS tokens per upload
};

// Transaction configuration
export const TX_CONFIG = {
  fee: '100000', // Base fee in stroops
  timeout: 30, // Transaction timeout in seconds
  maxRetries: 3, // Max retry attempts for failed transactions
};
