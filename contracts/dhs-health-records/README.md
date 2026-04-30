# DHS Health Records Smart Contract

A production-ready Soroban smart contract for decentralized health record management on Stellar.

## 📋 Overview

This smart contract enables:
- **Secure Storage**: Store IPFS CIDs of encrypted medical records
- **Access Control**: Wallet-based authentication using Soroban's native auth
- **Audit Trail**: Timestamp tracking for all records
- **Token Rewards**: DHS token rewards for uploading records
- **Privacy**: Only record owners can view their data

## 🏗️ Architecture

### Data Structures

```rust
pub struct HealthRecord {
    pub cid: String,           // IPFS Content Identifier
    pub timestamp: u64,        // Unix timestamp
    pub name: String,          // Record name/description
    pub record_type: String,   // Type (e.g., "lab_result", "prescription")
}
```

### Storage Keys

- `Admin` - Contract administrator address
- `Records(Address)` - User's medical records (Vector)
- `Balance(Address)` - User's DHS token balance
- `TotalRecords` - Global record counter

## 🚀 Deployment Guide

### Prerequisites

1. **Install Rust and Soroban CLI**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add wasm32 target
rustup target add wasm32-unknown-unknown

# Install Soroban CLI
cargo install --locked soroban-cli --features opt
```

2. **Configure Stellar Testnet**
```bash
# Add Testnet network
soroban network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

# Generate identity (or use existing)
soroban keys generate --global alice --network testnet

# Fund your account
curl "https://friendbot.stellar.org?addr=$(soroban keys address alice)"
```

### Build the Contract

```bash
# Navigate to contract directory
cd contracts/dhs-health-records

# Build optimized WASM
soroban contract build

# The compiled WASM will be at:
# target/wasm32-unknown-unknown/release/dhs_health_records.wasm
```

### Deploy to Testnet

```bash
# Deploy the contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/dhs_health_records.wasm \
  --source alice \
  --network testnet

# Output will be your CONTRACT_ID (save this!)
# Example: CBGTG6KZWFZQXQVQVQVQVQVQVQVQVQVQVQVQVQVQVQVQVQVQVQVQ
```

### Initialize the Contract

```bash
# Set your contract ID
export CONTRACT_ID="YOUR_CONTRACT_ID_HERE"

# Initialize with admin address
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  initialize \
  --admin $(soroban keys address alice)
```

### Verify Deployment

```bash
# Get admin address
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  get_admin

# Get total records (should be 0)
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  get_total_records
```

## 📝 Contract Functions

### Core Functions

#### 1. `initialize(admin: Address)`
Initialize the contract with an admin address.
- **Auth Required**: Admin
- **One-time only**

#### 2. `add_record(user: Address, cid: String, name: String, record_type: String) -> u32`
Add a new medical record.
- **Auth Required**: User (caller)
- **Returns**: Record index
- **Reward**: 10 DHS tokens

#### 3. `get_records(user: Address) -> Vec<HealthRecord>`
Retrieve all records for a user.
- **Auth Required**: User (owner only)
- **Returns**: Vector of health records

#### 4. `get_record_by_index(user: Address, index: u32) -> HealthRecord`
Get a specific record by index.
- **Auth Required**: User
- **Returns**: Single health record

#### 5. `get_record_count(user: Address) -> u32`
Get total number of records for a user.
- **Auth Required**: User
- **Returns**: Record count

### Token Functions

#### 6. `get_balance(user: Address) -> i128`
Get DHS token balance for a user.
- **Auth Required**: None (public read)
- **Returns**: Token balance (in stroops, 7 decimals)

#### 7. `transfer(from: Address, to: Address, amount: i128)`
Transfer DHS tokens between users.
- **Auth Required**: Sender
- **Panics**: If insufficient balance

### Admin Functions

#### 8. `get_total_records() -> u64`
Get total records across all users.
- **Auth Required**: None (public read)
- **Returns**: Total record count

#### 9. `get_admin() -> Address`
Get the admin address.
- **Auth Required**: None (public read)
- **Returns**: Admin address

## 🔌 Frontend Integration

### Setup

```javascript
import * as StellarSdk from '@stellar/stellar-sdk';
import { Contract, SorobanRpc } from '@stellar/stellar-sdk';

// Contract configuration
const CONTRACT_ID = 'YOUR_CONTRACT_ID_HERE';
const RPC_URL = 'https://soroban-testnet.stellar.org:443';
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

// Initialize RPC server
const server = new SorobanRpc.Server(RPC_URL);

// Initialize contract
const contract = new Contract(CONTRACT_ID);
```

### Example: Add a Record

```javascript
async function addHealthRecord(userKeypair, cid, name, recordType) {
  try {
    // Build the transaction
    const account = await server.getAccount(userKeypair.publicKey());
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'add_record',
          StellarSdk.Address.fromString(userKeypair.publicKey()).toScVal(),
          StellarSdk.nativeToScVal(cid, { type: 'string' }),
          StellarSdk.nativeToScVal(name, { type: 'string' }),
          StellarSdk.nativeToScVal(recordType, { type: 'string' })
        )
      )
      .setTimeout(30)
      .build();

    // Prepare and sign
    const prepared = await server.prepareTransaction(transaction);
    prepared.sign(userKeypair);

    // Submit
    const result = await server.sendTransaction(prepared);
    
    // Wait for confirmation
    let status;
    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      status = await server.getTransaction(result.hash);
    } while (status.status === 'PENDING');

    if (status.status === 'SUCCESS') {
      console.log('Record added successfully!');
      return status;
    } else {
      throw new Error('Transaction failed');
    }
  } catch (error) {
    console.error('Error adding record:', error);
    throw error;
  }
}

// Usage
const cid = 'QmX7Kd9fH3pQ2vR8sT1uW6yZ4aB5cD7eF9gH2iJ3kL4mN5';
const name = 'Blood Test Results - March 2025';
const recordType = 'lab_result';

await addHealthRecord(userKeypair, cid, name, recordType);
```

### Example: Get Records

```javascript
async function getHealthRecords(userAddress) {
  try {
    const account = await server.getAccount(userAddress);
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'get_records',
          StellarSdk.Address.fromString(userAddress).toScVal()
        )
      )
      .setTimeout(30)
      .build();

    const prepared = await server.prepareTransaction(transaction);
    const simulated = await server.simulateTransaction(prepared);

    if (simulated.results && simulated.results.length > 0) {
      const records = StellarSdk.scValToNative(simulated.results[0].xdr);
      return records;
    }
    
    return [];
  } catch (error) {
    console.error('Error getting records:', error);
    throw error;
  }
}

// Usage
const records = await getHealthRecords(userAddress);
console.log('User records:', records);
```

### Example: Get Token Balance

```javascript
async function getDHSBalance(userAddress) {
  try {
    const transaction = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account(userAddress, '0'),
      {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      }
    )
      .addOperation(
        contract.call(
          'get_balance',
          StellarSdk.Address.fromString(userAddress).toScVal()
        )
      )
      .setTimeout(30)
      .build();

    const simulated = await server.simulateTransaction(transaction);
    
    if (simulated.results && simulated.results.length > 0) {
      const balance = StellarSdk.scValToNative(simulated.results[0].xdr);
      // Convert from stroops to DHS (7 decimals)
      return balance / 10000000;
    }
    
    return 0;
  } catch (error) {
    console.error('Error getting balance:', error);
    return 0;
  }
}

// Usage
const balance = await getDHSBalance(userAddress);
console.log(`DHS Balance: ${balance} DHS`);
```

## 🧪 Testing

### Run Unit Tests

```bash
# Run all tests
cargo test

# Run with output
cargo test -- --nocapture

# Run specific test
cargo test test_add_and_get_record
```

### Test Coverage

The contract includes comprehensive tests:
- ✅ Initialization
- ✅ Adding records
- ✅ Retrieving records
- ✅ Multiple records per user
- ✅ Token rewards
- ✅ Token transfers
- ✅ Insufficient balance handling

## 🔐 Security Features

1. **Authentication**: All sensitive operations require wallet signature
2. **Access Control**: Users can only view their own records
3. **Data Privacy**: Only IPFS CIDs stored on-chain (actual data encrypted off-chain)
4. **Immutability**: Records cannot be deleted or modified (audit trail)
5. **Overflow Protection**: Safe arithmetic operations

## 📊 Gas Optimization

- Efficient storage using Soroban's persistent storage
- Minimal data structures
- Optimized WASM compilation with `opt-level = "z"`
- LTO (Link Time Optimization) enabled

## 🎯 Token Economics

- **Upload Reward**: 10 DHS tokens per record
- **Decimals**: 7 (Stellar standard)
- **Transfer**: Peer-to-peer token transfers supported
- **Balance Tracking**: Internal balance mapping

## 📚 Additional Resources

- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar SDK for JavaScript](https://stellar.github.io/js-stellar-sdk/)
- [Freighter Wallet Integration](https://www.freighter.app/docs/guide/introduction)

## 🐛 Troubleshooting

### Build Issues
```bash
# Clean and rebuild
cargo clean
cargo build --target wasm32-unknown-unknown --release
```

### Deployment Issues
```bash
# Check account balance
soroban keys address alice
curl "https://friendbot.stellar.org?addr=$(soroban keys address alice)"

# Verify network configuration
soroban network ls
```

### Transaction Failures
- Ensure sufficient XLM for fees
- Verify contract is initialized
- Check authentication signatures
- Review transaction simulation results

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

**Built with ❤️ for decentralized healthcare**
