/**
 * DHS Contract Service
 * Handles all interactions with the Soroban smart contract
 */

import * as StellarSdk from '@stellar/stellar-sdk';
import { 
  isConnected, 
  getAddress,
  signTransaction 
} from '@stellar/freighter-api';
import { 
  CONTRACT_ID, 
  NETWORK_CONFIG, 
  CONTRACT_FUNCTIONS,
  TX_CONFIG 
} from '../config/contract';

class ContractService {
  constructor() {
    // Graceful fallback for SorobanRpc.Server initialization
    try {
      // Try new SDK structure first
      if (StellarSdk.SorobanRpc && StellarSdk.SorobanRpc.Server) {
        this.server = new StellarSdk.SorobanRpc.Server(NETWORK_CONFIG.rpcUrl);
      } else if (StellarSdk.Server) {
        // Fallback to older SDK structure
        this.server = new StellarSdk.Server(NETWORK_CONFIG.rpcUrl);
      } else {
        console.warn('⚠️ Soroban RPC Server not available in SDK. Contract features will be limited.');
        this.server = null;
      }
    } catch (error) {
      console.error('❌ Failed to initialize Soroban RPC Server:', error);
      this.server = null;
    }
    
    // Initialize contract
    try {
      this.contract = new StellarSdk.Contract(CONTRACT_ID);
    } catch (error) {
      console.error('❌ Failed to initialize contract:', error);
      this.contract = null;
    }
    
    // Cache for user address
    this.userAddress = null;
  }

  /**
   * Check if Freighter wallet is connected
   * @returns {Promise<boolean>}
   */
  async isWalletConnected() {
    try {
      const result = await isConnected();
      return result.isConnected || false;
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      return false;
    }
  }

  /**
   * Get user's public key from Freighter
   * @returns {Promise<string>} User's public key
   */
  async getUserAddress() {
    try {
      if (this.userAddress) {
        return this.userAddress;
      }
      
      const result = await getAddress();
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to get wallet address');
      }
      
      const publicKey = result.address;
      
      if (!publicKey) {
        throw new Error('No wallet address returned');
      }
      
      this.userAddress = publicKey;
      return publicKey;
    } catch (error) {
      console.error('Error getting user address:', error);
      throw new Error('Failed to get wallet address. Please connect Freighter wallet.');
    }
  }

  /**
   * Sign transaction with Freighter
   * @private
   * @param {Transaction} transaction - Prepared transaction
   * @param {string} userAddress - User's wallet address
   * @returns {Promise<Transaction>} Signed transaction
   */
  async signWithFreighter(transaction, userAddress) {
    const signResult = await signTransaction(transaction.toXDR(), {
      address: userAddress,
      networkPassphrase: NETWORK_CONFIG.networkPassphrase,
    });

    if (signResult.error) {
      throw new Error(signResult.error.message || 'Transaction signing failed');
    }

    return StellarSdk.TransactionBuilder.fromXDR(
      signResult.signedTxXdr,
      NETWORK_CONFIG.networkPassphrase
    );
  }

  /**
   * Add a new medical record to the blockchain
   * @param {string} cid - IPFS Content Identifier
   * @param {string} name - Record name
   * @param {string} recordType - Type of record (e.g., "lab_result", "prescription")
   * @returns {Promise<number>} Record index
   */
  async addRecord(cid, name, recordType) {
    try {
      const userAddress = await this.getUserAddress();
      const account = await this.server.getAccount(userAddress);

      // Build transaction
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: TX_CONFIG.fee,
        networkPassphrase: NETWORK_CONFIG.networkPassphrase,
      })
        .addOperation(
          this.contract.call(
            CONTRACT_FUNCTIONS.ADD_RECORD,
            StellarSdk.Address.fromString(userAddress).toScVal(),
            StellarSdk.nativeToScVal(cid, { type: 'string' }),
            StellarSdk.nativeToScVal(name, { type: 'string' }),
            StellarSdk.nativeToScVal(recordType, { type: 'string' })
          )
        )
        .setTimeout(TX_CONFIG.timeout)
        .build();

      // Prepare transaction
      const prepared = await this.server.prepareTransaction(transaction);

      // Sign with Freighter
      const signedTx = await this.signWithFreighter(prepared, userAddress);

      // Submit transaction
      const result = await this.server.sendTransaction(signedTx);

      // Wait for confirmation
      const status = await this.waitForTransaction(result.hash);

      if (status.status === 'SUCCESS') {
        // Extract record index from result
        const recordIndex = StellarSdk.scValToNative(status.returnValue);
        console.log('✅ Record added successfully at index:', recordIndex);
        return recordIndex;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error adding record:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get all medical records for the current user
   * @returns {Promise<Array>} Array of health records
   */
  async getRecords() {
    try {
      const userAddress = await this.getUserAddress();
      const account = await this.server.getAccount(userAddress);

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: TX_CONFIG.fee,
        networkPassphrase: NETWORK_CONFIG.networkPassphrase,
      })
        .addOperation(
          this.contract.call(
            CONTRACT_FUNCTIONS.GET_RECORDS,
            StellarSdk.Address.fromString(userAddress).toScVal()
          )
        )
        .setTimeout(TX_CONFIG.timeout)
        .build();

      const prepared = await this.server.prepareTransaction(transaction);

      // Sign with Freighter
      const signedTx = await this.signWithFreighter(prepared, userAddress);

      // Submit and wait
      const result = await this.server.sendTransaction(signedTx);
      const status = await this.waitForTransaction(result.hash);

      if (status.status === 'SUCCESS') {
        const records = StellarSdk.scValToNative(status.returnValue);
        console.log('✅ Records retrieved:', records?.length || 0);
        return this.formatRecords(records || []);
      }

      return [];
    } catch (error) {
      console.error('Error getting records:', error);
      // Return empty array instead of throwing to handle gracefully
      return [];
    }
  }

  /**
   * Get a specific record by index
   * @param {number} index - Record index
   * @returns {Promise<Object>} Health record
   */
  async getRecordByIndex(index) {
    try {
      const userAddress = await this.getUserAddress();
      const account = await this.server.getAccount(userAddress);

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: TX_CONFIG.fee,
        networkPassphrase: NETWORK_CONFIG.networkPassphrase,
      })
        .addOperation(
          this.contract.call(
            CONTRACT_FUNCTIONS.GET_RECORD_BY_INDEX,
            StellarSdk.Address.fromString(userAddress).toScVal(),
            StellarSdk.nativeToScVal(index, { type: 'u32' })
          )
        )
        .setTimeout(TX_CONFIG.timeout)
        .build();

      const prepared = await this.server.prepareTransaction(transaction);
      const signedTx = await this.signWithFreighter(prepared, userAddress);
      );

      const result = await this.server.sendTransaction(signedTx);
      const status = await this.waitForTransaction(result.hash);

      if (status.status === 'SUCCESS') {
        const record = StellarSdk.scValToNative(status.returnValue);
        return this.formatRecord(record);
      }

      return null;
    } catch (error) {
      console.error('Error getting record by index:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get record count for current user
   * @returns {Promise<number>} Number of records
   */
  async getRecordCount() {
    try {
      const userAddress = await this.getUserAddress();
      const account = await this.server.getAccount(userAddress);

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: TX_CONFIG.fee,
        networkPassphrase: NETWORK_CONFIG.networkPassphrase,
      })
        .addOperation(
          this.contract.call(
            CONTRACT_FUNCTIONS.GET_RECORD_COUNT,
            StellarSdk.Address.fromString(userAddress).toScVal()
          )
        )
        .setTimeout(TX_CONFIG.timeout)
        .build();

      const prepared = await this.server.prepareTransaction(transaction);
      const signedTx = await this.signWithFreighter(prepared, userAddress);
      );

      const result = await this.server.sendTransaction(signedTx);
      const status = await this.waitForTransaction(result.hash);

      if (status.status === 'SUCCESS') {
        return StellarSdk.scValToNative(status.returnValue);
      }

      return 0;
    } catch (error) {
      console.error('Error getting record count:', error);
      return 0;
    }
  }

  /**
   * Get DHS token balance for current user
   * @returns {Promise<number>} Token balance in DHS
   */
  async getBalance() {
    try {
      const userAddress = await this.getUserAddress();

      // Use simulation for read-only operations (no signature needed)
      const transaction = new StellarSdk.TransactionBuilder(
        new StellarSdk.Account(userAddress, '0'),
        {
          fee: TX_CONFIG.fee,
          networkPassphrase: NETWORK_CONFIG.networkPassphrase,
        }
      )
        .addOperation(
          this.contract.call(
            CONTRACT_FUNCTIONS.GET_BALANCE,
            StellarSdk.Address.fromString(userAddress).toScVal()
          )
        )
        .setTimeout(TX_CONFIG.timeout)
        .build();

      const simulated = await this.server.simulateTransaction(transaction);

      if (simulated.results && simulated.results.length > 0) {
        const balanceStroops = StellarSdk.scValToNative(
          simulated.results[0].xdr
        );
        // Convert from stroops to DHS (7 decimals)
        return balanceStroops / 10000000;
      }

      return 0;
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  }

  /**
   * Wait for transaction confirmation
   * @private
   * @param {string} hash - Transaction hash
   * @param {number} maxAttempts - Maximum retry attempts
   * @returns {Promise<Object>} Transaction status
   */
  async waitForTransaction(hash, maxAttempts = 30) {
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const status = await this.server.getTransaction(hash);

        if (status.status !== 'NOT_FOUND' && status.status !== 'PENDING') {
          return status;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        attempts++;
      } catch (error) {
        console.error('Error checking transaction status:', error);
        attempts++;
      }
    }

    throw new Error('Transaction timeout - please check Stellar Explorer');
  }

  /**
   * Format records array
   * @private
   * @param {Array} records - Raw records from contract
   * @returns {Array} Formatted records
   */
  formatRecords(records) {
    if (!Array.isArray(records)) {
      return [];
    }

    return records.map((record, index) => this.formatRecord(record, index));
  }

  /**
   * Format a single record
   * @private
   * @param {Object} record - Raw record from contract
   * @param {number} index - Record index
   * @returns {Object} Formatted record
   */
  formatRecord(record, index) {
    return {
      id: index,
      cid: record.cid || '',
      name: record.name || 'Untitled Record',
      recordType: record.record_type || 'unknown',
      timestamp: record.timestamp || Date.now() / 1000,
      date: this.formatDate(record.timestamp),
      ipfsUrl: `https://ipfs.io/ipfs/${record.cid}`,
    };
  }

  /**
   * Format timestamp to readable date
   * @private
   * @param {number} timestamp - Unix timestamp
   * @returns {string} Formatted date
   */
  formatDate(timestamp) {
    if (!timestamp) return 'Unknown';
    
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Handle and format errors
   * @private
   * @param {Error} error - Original error
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.message?.includes('User declined')) {
      return new Error('Transaction cancelled by user');
    }
    
    if (error.message?.includes('timeout')) {
      return new Error('Transaction timeout - please try again');
    }
    
    if (error.message?.includes('insufficient')) {
      return new Error('Insufficient XLM balance for transaction fees');
    }

    return new Error(error.message || 'Transaction failed - please try again');
  }

  /**
   * Clear cached user address (useful for wallet switching)
   */
  clearCache() {
    this.userAddress = null;
  }
}

// Export singleton instance
export default new ContractService();
