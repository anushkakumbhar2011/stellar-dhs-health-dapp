# 🚀 Quick Start Guide - DHS Smart Contract

Get your DHS Health Records contract deployed in 5 minutes!

## ⚡ Prerequisites (2 minutes)

```bash
# 1. Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# 2. Add WebAssembly target
rustup target add wasm32-unknown-unknown

# 3. Install Soroban CLI
cargo install --locked soroban-cli --features opt

# Verify installation
soroban --version
```

## 🎯 Automated Deployment (1 minute)

```bash
# Navigate to contract directory
cd contracts/dhs-health-records

# Run automated deployment script
./deploy.sh
```

That's it! The script will:
- ✅ Configure Stellar Testnet
- ✅ Generate and fund your identity
- ✅ Build the contract
- ✅ Deploy to testnet
- ✅ Initialize the contract
- ✅ Generate frontend configuration
- ✅ Save deployment info

## 📋 What You Get

After deployment, you'll see:

```
🎉 Deployment Complete!
========================================

📋 Summary:
  • Network: testnet
  • Contract ID: CBGTG6KZWFZQXQVQVQVQVQVQVQVQVQVQVQVQVQVQVQVQVQVQVQVQ
  • Admin Address: GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  • WASM Size: 45K

🔗 Useful Links:
  • Stellar Expert: https://stellar.expert/explorer/testnet/contract/...
  • RPC Endpoint: https://soroban-testnet.stellar.org:443
```

## 🧪 Test Your Contract (1 minute)

```bash
# Set your contract ID (from deployment output)
export CONTRACT_ID="YOUR_CONTRACT_ID_HERE"

# Test 1: Get admin address
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  get_admin

# Test 2: Get total records (should be 0)
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  get_total_records

# Test 3: Add a test record
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  add_record \
  --user $(soroban keys address alice) \
  --cid "QmTestCID123" \
  --name "Test Record" \
  --record_type "test"

# Test 4: Get your balance (should be 10 DHS)
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  get_balance \
  --user $(soroban keys address alice)
```

## 🔌 Connect to Frontend (1 minute)

The deployment script automatically creates `src/config/contract.js`:

```javascript
export const CONTRACT_CONFIG = {
  contractId: 'YOUR_CONTRACT_ID',
  network: 'testnet',
  rpcUrl: 'https://soroban-testnet.stellar.org:443',
  // ... more config
};
```

Just import and use:

```javascript
import { CONTRACT_CONFIG } from './config/contract';
import contractService from './services/contractService';

// Add a record
await contractService.addRecord(
  'QmX7Kd9fH3pQ2vR8sT1uW6yZ4aB5cD7eF9gH2iJ3kL4mN5',
  'Blood Test Results',
  'lab_result'
);

// Get records
const records = await contractService.getRecords();
console.log(records);
```

## 📱 Manual Deployment (Alternative)

If you prefer manual control:

```bash
# 1. Build
cd contracts/dhs-health-records
cargo build --target wasm32-unknown-unknown --release

# 2. Configure network
soroban network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

# 3. Generate identity
soroban keys generate --global alice --network testnet

# 4. Fund account
curl "https://friendbot.stellar.org?addr=$(soroban keys address alice)"

# 5. Deploy
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/dhs_health_records.wasm \
  --source alice \
  --network testnet)

echo "Contract ID: $CONTRACT_ID"

# 6. Initialize
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  initialize \
  --admin $(soroban keys address alice)
```

## 🎓 Next Steps

1. **Test All Functions**: Try all contract functions via CLI
2. **Integrate Frontend**: Use the generated config file
3. **Monitor Transactions**: Check Stellar Expert
4. **Read Documentation**: See CONTRACT_OVERVIEW.md for details
5. **Build Features**: Start integrating with your React app

## 🆘 Troubleshooting

### "Command not found: soroban"
```bash
# Reinstall Soroban CLI
cargo install --locked soroban-cli --features opt
source $HOME/.cargo/env
```

### "Insufficient balance"
```bash
# Fund your account again
curl "https://friendbot.stellar.org?addr=$(soroban keys address alice)"
```

### "Contract already initialized"
```bash
# This is normal - contract is ready to use
# Skip the initialize step
```

### "Build failed"
```bash
# Clean and rebuild
cargo clean
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --release
```

## 📚 Documentation

- **Full Guide**: See `README.md` in contract directory
- **Integration**: See `FRONTEND_INTEGRATION.md`
- **Architecture**: See `CONTRACT_OVERVIEW.md`
- **Soroban Docs**: https://soroban.stellar.org/docs

## 💡 Pro Tips

1. **Save Your Contract ID**: You'll need it for frontend integration
2. **Backup Your Keys**: Store your identity securely
3. **Monitor Gas Costs**: Check transaction fees on Stellar Expert
4. **Test Thoroughly**: Use testnet before mainnet
5. **Read Error Messages**: They're usually helpful

## 🎉 Success Checklist

- [ ] Contract deployed successfully
- [ ] Contract initialized
- [ ] Test functions work via CLI
- [ ] Frontend config generated
- [ ] Contract ID saved
- [ ] Stellar Expert shows your contract
- [ ] Ready to integrate with React app

---

**Time to Deploy**: ~5 minutes  
**Difficulty**: Easy  
**Cost**: Free (Testnet)  

**Happy Building! 🚀**
