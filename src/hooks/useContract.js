/**
 * useContract Hook
 * React hook for interacting with the DHS smart contract
 */

import { useState, useEffect, useCallback } from 'react';
import contractService from '../services/contractService';
import { TOKEN_CONFIG } from '../config/contract';

export function useContract() {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [records, setRecords] = useState([]);
  const [recordCount, setRecordCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Check wallet connection on mount and periodically
   */
  useEffect(() => {
    checkConnection();
    
    // Re-check connection every 2 seconds
    const interval = setInterval(checkConnection, 2000);
    
    return () => clearInterval(interval);
  }, []);

  /**
   * Check if wallet is connected
   */
  const checkConnection = async () => {
    try {
      const connected = await contractService.isWalletConnected();
      setIsConnected(connected);

      if (connected) {
        const address = await contractService.getUserAddress();
        setUserAddress(address);
        await Promise.all([
          loadBalance(),
          loadRecordCount(),
        ]);
      }
    } catch (err) {
      console.error('Connection check failed:', err);
      setIsConnected(false);
    }
  };

  /**
   * Load user's DHS token balance
   */
  const loadBalance = async () => {
    try {
      const bal = await contractService.getBalance();
      setBalance(bal);
    } catch (err) {
      console.error('Failed to load balance:', err);
    }
  };

  /**
   * Load user's record count
   */
  const loadRecordCount = async () => {
    try {
      const count = await contractService.getRecordCount();
      setRecordCount(count);
    } catch (err) {
      console.error('Failed to load record count:', err);
    }
  };

  /**
   * Add a new medical record
   * @param {string} cid - IPFS Content Identifier
   * @param {string} name - Record name
   * @param {string} recordType - Type of record
   * @returns {Promise<number>} Record index
   */
  const addRecord = useCallback(async (cid, name, recordType) => {
    setLoading(true);
    setError(null);

    try {
      const index = await contractService.addRecord(cid, name, recordType);
      
      // Refresh data after successful upload
      await Promise.all([
        loadBalance(),
        loadRecordCount(),
      ]);

      return index;
    } catch (err) {
      const errorMessage = err.message || 'Failed to add record';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get all medical records for the user
   * @returns {Promise<Array>} Array of records
   */
  const getRecords = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userRecords = await contractService.getRecords();
      setRecords(userRecords);
      return userRecords;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch records';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a specific record by index
   * @param {number} index - Record index
   * @returns {Promise<Object>} Record object
   */
  const getRecordByIndex = useCallback(async (index) => {
    setLoading(true);
    setError(null);

    try {
      const record = await contractService.getRecordByIndex(index);
      return record;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch record';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh all data
   */
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        loadBalance(),
        loadRecordCount(),
        getRecords(),
      ]);
    } catch (err) {
      console.error('Failed to refresh data:', err);
    } finally {
      setLoading(false);
    }
  }, [getRecords]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isConnected,
    userAddress,
    balance,
    records,
    recordCount,
    loading,
    error,

    // Actions
    addRecord,
    getRecords,
    getRecordByIndex,
    refresh,
    clearError,
    checkConnection,

    // Utilities
    rewardAmount: TOKEN_CONFIG.uploadReward,
  };
}
