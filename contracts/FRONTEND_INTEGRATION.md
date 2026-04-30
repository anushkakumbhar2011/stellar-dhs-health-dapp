# Frontend Integration Guide

Complete guide for integrating the DHS Health Records smart contract with your React frontend.

## 📦 Installation

```bash
npm install @stellar/stellar-sdk @stellar/freighter-api
```

## 🔧 Setup Contract Service

Create a new file: `src/services/contractService.js`

```javascript
import * as StellarSdk from '@stellar/stellar-sdk';
import { isConnected, getPublicKey, signTransaction } from '@stellar/freighter-api';

// Import contract configuration
import { CONTRACT_CONFIG, CONTRACT_FUNCTIONS } from '../config/contract';

class ContractService {
  constructor() {
    this.server = new StellarSdk.SorobanRpc.Server(CONTRACT_CONFIG.rpcUrl);
    this.contract = new StellarSdk.Contract(CONTRACT_CONFIG.contractId);
  }

  /**
   * Check if Freighter wallet is connected
   */
  async isWalletConnected() {
    return await isConnected();
  }

  /**
   * Get user's public key from Freighter
   */
  async getUserAddress() {
    return await getPublicKey();
  }

  /**
   * Add a new health record
   * @param {string} cid - IPFS Content Identifier
   * @param {string} name - Record name
   * @param {string} recordType - Type of record (e.g., "lab_result")
   * @returns {Promise<number>} Record index
   */
  async addRecord(cid, name, recordType) {
    try {
      const userAddress = await this.getUserAddress();
      const account = await this.server.getAccount(userAddress);

      // Build transaction
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: CONTRACT_CONFIG.networkPassphrase,
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
        .setTimeout(30)
        .build();

      // Prepare transaction
      const prepared = await this.server.prepareTransaction(transaction);

      // Sign with Freighter
      const signedXdr = await signTransaction(prepared.toXDR(), {
        network: CONTRACT_CONFIG.network,
        networkPassphrase: CONTRACT_CONFIG.networkPassphrase,
      });

      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        CONTRACT_CONFIG.networkPassphrase
      );

      // Submit transaction
      const result = await this.server.sendTransaction(signedTx);

      // Wait for confirmation
      const status = await this.waitForTransaction(result.hash);

      if (status.status === 'SUCCESS') {
        // Extract record index from result
        const recordIndex = StellarSdk.scValToNative(
          status.returnValue
        );
        return recordIndex;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error adding record:', error);
      throw error;
    }
  }

  /**
   * Get all health records for the current user
   * @returns {Promise<Array>} Array of health records
   */
  async getRecords() {
    try {
      const userAddress = await this.getUserAddress();
      const account = await this.server.getAccount(userAddress);

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: CONTRACT_CONFIG.networkPassphrase,
      })
        .addOperation(
          this.contract.call(
            CONTRACT_FUNCTIONS.GET_RECORDS,
            StellarSdk.Address.fromString(userAddress).toScVal()
          )
        )
        .setTimeout(30)
        .build();

      const prepared = await this.server.prepareTransaction(transaction);

      // Sign with Freighter
      const signedXdr = await signTransaction(prepared.toXDR(), {
        network: CONTRACT_CONFIG.network,
        networkPassphrase: CONTRACT_CONFIG.networkPassphrase,
      });

      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        CONTRACT_CONFIG.networkPassphrase
      );

      // Submit and wait
      const result = await this.server.sendTransaction(signedTx);
      const status = await this.waitForTransaction(result.hash);

      if (status.status === 'SUCCESS') {
        const records = StellarSdk.scValToNative(status.returnValue);
        return records || [];
      }

      return [];
    } catch (error) {
      console.error('Error getting records:', error);
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
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: CONTRACT_CONFIG.networkPassphrase,
      })
        .addOperation(
          this.contract.call(
            CONTRACT_FUNCTIONS.GET_RECORD_BY_INDEX,
            StellarSdk.Address.fromString(userAddress).toScVal(),
            StellarSdk.nativeToScVal(index, { type: 'u32' })
          )
        )
        .setTimeout(30)
        .build();

      const prepared = await this.server.prepareTransaction(transaction);
      const signedXdr = await signTransaction(prepared.toXDR(), {
        network: CONTRACT_CONFIG.network,
        networkPassphrase: CONTRACT_CONFIG.networkPassphrase,
      });

      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        CONTRACT_CONFIG.networkPassphrase
      );

      const result = await this.server.sendTransaction(signedTx);
      const status = await this.waitForTransaction(result.hash);

      if (status.status === 'SUCCESS') {
        return StellarSdk.scValToNative(status.returnValue);
      }

      return null;
    } catch (error) {
      console.error('Error getting record by index:', error);
      throw error;
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
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: CONTRACT_CONFIG.networkPassphrase,
      })
        .addOperation(
          this.contract.call(
            CONTRACT_FUNCTIONS.GET_RECORD_COUNT,
            StellarSdk.Address.fromString(userAddress).toScVal()
          )
        )
        .setTimeout(30)
        .build();

      const prepared = await this.server.prepareTransaction(transaction);
      const signedXdr = await signTransaction(prepared.toXDR(), {
        network: CONTRACT_CONFIG.network,
        networkPassphrase: CONTRACT_CONFIG.networkPassphrase,
      });

      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        CONTRACT_CONFIG.networkPassphrase
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

      // Use simulation for read-only operations
      const transaction = new StellarSdk.TransactionBuilder(
        new StellarSdk.Account(userAddress, '0'),
        {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: CONTRACT_CONFIG.networkPassphrase,
        }
      )
        .addOperation(
          this.contract.call(
            CONTRACT_FUNCTIONS.GET_BALANCE,
            StellarSdk.Address.fromString(userAddress).toScVal()
          )
        )
        .setTimeout(30)
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
   * Transfer DHS tokens to another user
   * @param {string} toAddress - Recipient address
   * @param {number} amount - Amount in DHS tokens
   */
  async transfer(toAddress, amount) {
    try {
      const fromAddress = await this.getUserAddress();
      const account = await this.server.getAccount(fromAddress);

      // Convert DHS to stroops
      const amountStroops = Math.floor(amount * 10000000);

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: CONTRACT_CONFIG.networkPassphrase,
      })
        .addOperation(
          this.contract.call(
            CONTRACT_FUNCTIONS.TRANSFER,
            StellarSdk.Address.fromString(fromAddress).toScVal(),
            StellarSdk.Address.fromString(toAddress).toScVal(),
            StellarSdk.nativeToScVal(amountStroops, { type: 'i128' })
          )
        )
        .setTimeout(30)
        .build();

      const prepared = await this.server.prepareTransaction(transaction);
      const signedXdr = await signTransaction(prepared.toXDR(), {
        network: CONTRACT_CONFIG.network,
        networkPassphrase: CONTRACT_CONFIG.networkPassphrase,
      });

      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        CONTRACT_CONFIG.networkPassphrase
      );

      const result = await this.server.sendTransaction(signedTx);
      const status = await this.waitForTransaction(result.hash);

      if (status.status === 'SUCCESS') {
        return true;
      }

      throw new Error('Transfer failed');
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw error;
    }
  }

  /**
   * Get total records across all users
   * @returns {Promise<number>} Total record count
   */
  async getTotalRecords() {
    try {
      const userAddress = await this.getUserAddress();

      const transaction = new StellarSdk.TransactionBuilder(
        new StellarSdk.Account(userAddress, '0'),
        {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: CONTRACT_CONFIG.networkPassphrase,
        }
      )
        .addOperation(
          this.contract.call(CONTRACT_FUNCTIONS.GET_TOTAL_RECORDS)
        )
        .setTimeout(30)
        .build();

      const simulated = await this.server.simulateTransaction(transaction);

      if (simulated.results && simulated.results.length > 0) {
        return StellarSdk.scValToNative(simulated.results[0].xdr);
      }

      return 0;
    } catch (error) {
      console.error('Error getting total records:', error);
      return 0;
    }
  }

  /**
   * Wait for transaction confirmation
   * @private
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

    throw new Error('Transaction timeout');
  }
}

// Export singleton instance
export default new ContractService();
```

## 🎯 React Hook for Contract Integration

Create: `src/hooks/useContract.js`

```javascript
import { useState, useEffect, useCallback } from 'react';
import contractService from '../services/contractService';

export function useContract() {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check wallet connection
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await contractService.isWalletConnected();
      setIsConnected(connected);

      if (connected) {
        const address = await contractService.getUserAddress();
        setUserAddress(address);
        await loadBalance();
      }
    } catch (err) {
      console.error('Connection check failed:', err);
    }
  };

  const loadBalance = async () => {
    try {
      const bal = await contractService.getBalance();
      setBalance(bal);
    } catch (err) {
      console.error('Failed to load balance:', err);
    }
  };

  const addRecord = useCallback(async (cid, name, recordType) => {
    setLoading(true);
    setError(null);

    try {
      const index = await contractService.addRecord(cid, name, recordType);
      await loadBalance(); // Refresh balance after reward
      return index;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecords = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const records = await contractService.getRecords();
      return records;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const transfer = useCallback(async (toAddress, amount) => {
    setLoading(true);
    setError(null);

    try {
      await contractService.transfer(toAddress, amount);
      await loadBalance(); // Refresh balance
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isConnected,
    userAddress,
    balance,
    loading,
    error,
    addRecord,
    getRecords,
    transfer,
    refreshBalance: loadBalance,
  };
}
```

## 💡 Usage Examples

### Example 1: Dashboard Component

```javascript
import React, { useEffect, useState } from 'react';
import { useContract } from '../hooks/useContract';

function Dashboard() {
  const { isConnected, userAddress, balance, getRecords, loading } = useContract();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (isConnected) {
      loadRecords();
    }
  }, [isConnected]);

  const loadRecords = async () => {
    const userRecords = await getRecords();
    setRecords(userRecords);
  };

  if (!isConnected) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div className="dashboard">
      <div className="wallet-info">
        <p>Address: {userAddress}</p>
        <p>DHS Balance: {balance} DHS</p>
      </div>

      <div className="records">
        <h2>Your Medical Records ({records.length})</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="records-grid">
            {records.map((record, index) => (
              <div key={index} className="record-card">
                <h3>{record.name}</h3>
                <p>Type: {record.record_type}</p>
                <p>CID: {record.cid}</p>
                <p>Date: {new Date(record.timestamp * 1000).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
```

### Example 2: Upload Component

```javascript
import React, { useState } from 'react';
import { useContract } from '../hooks/useContract';

function UploadRecord() {
  const { addRecord, loading, error } = useContract();
  const [formData, setFormData] = useState({
    cid: '',
    name: '',
    recordType: 'lab_result',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const index = await addRecord(
        formData.cid,
        formData.name,
        formData.recordType
      );

      alert(`Record added successfully! Index: ${index}. You earned 10 DHS tokens!`);
      
      // Reset form
      setFormData({ cid: '', name: '', recordType: 'lab_result' });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="upload-form">
      <h2>Upload Medical Record</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>IPFS CID</label>
          <input
            type="text"
            value={formData.cid}
            onChange={(e) => setFormData({ ...formData, cid: e.target.value })}
            placeholder="QmX7Kd9fH3pQ2vR8sT1uW6yZ4aB5cD7eF9gH2iJ3kL4mN5"
            required
          />
        </div>

        <div className="form-group">
          <label>Record Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Blood Test Results - March 2025"
            required
          />
        </div>

        <div className="form-group">
          <label>Record Type</label>
          <select
            value={formData.recordType}
            onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
          >
            <option value="lab_result">Lab Result</option>
            <option value="prescription">Prescription</option>
            <option value="mri_scan">MRI Scan</option>
            <option value="xray">X-Ray</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Record'}
        </button>

        {error && <p className="error">{error}</p>}
      </form>

      <p className="reward-info">
        💰 Earn 10 DHS tokens for each record uploaded!
      </p>
    </div>
  );
}

export default UploadRecord;
```

## 🔐 Security Best Practices

1. **Never store private keys in frontend code**
2. **Always use Freighter for signing transactions**
3. **Validate user inputs before sending to contract**
4. **Handle errors gracefully**
5. **Show transaction status to users**

## 📚 Additional Resources

- [Stellar SDK Documentation](https://stellar.github.io/js-stellar-sdk/)
- [Freighter API Docs](https://www.freighter.app/docs/guide/introduction)
- [Soroban RPC Reference](https://soroban.stellar.org/docs/reference/rpc)

---

**Ready to integrate! 🚀**
