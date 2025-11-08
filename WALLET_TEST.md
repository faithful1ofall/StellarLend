# Wallet Connection Test Guide

## Testing Stellar Wallet Kit Integration

### Prerequisites
1. Install Freighter wallet extension: https://www.freighter.app/
2. Switch to Stellar Testnet in Freighter settings
3. Fund your testnet account: https://laboratory.stellar.org/#account-creator

### Test Steps

#### 1. Open the Frontend
Navigate to: [https://5173--019a64ef-3380-7614-b217-b77d02dc2136.eu-central-1-01.gitpod.dev](https://5173--019a64ef-3380-7614-b217-b77d02dc2136.eu-central-1-01.gitpod.dev)

#### 2. Click "Connect Wallet"
- A modal should appear showing available wallets
- Select "Freighter"
- Approve the connection in the Freighter popup

#### 3. Verify Connection
✅ Your wallet address should appear in the header (e.g., `GBZS...DFA2`)  
✅ The "Connect Wallet" button should change to "Disconnect"  
✅ Contract addresses should be visible  

#### 4. Test Disconnect
- Click "Disconnect" button
- Address should disappear
- Button should change back to "Connect Wallet"

### Expected Behavior

**Before Connection:**
```
Header: 🌟 StellarLend | [Connect Wallet]
Body: Welcome message with features list
```

**After Connection:**
```
Header: 🌟 StellarLend | [GBZS...DFA2] [Disconnect]
Body: Contract addresses and CLI commands
```

### Troubleshooting

**Issue: Modal doesn't appear**
- Check browser console for errors
- Ensure Freighter is installed
- Try refreshing the page

**Issue: Connection fails**
- Check Freighter is unlocked
- Verify you're on Testnet
- Check browser console for error messages

**Issue: Address doesn't display**
- Check React DevTools for state updates
- Verify publicKey is being set in useFreighter hook
- Check console for any errors

### Manual Testing with Browser Console

Open browser console and test:

```javascript
// Check if Stellar Wallet Kit is loaded
console.log(window);

// Check wallet state
// (React DevTools > Components > App > useFreighter)
```

### CLI Testing

Test contract interactions with connected wallet:

```bash
# Mint NFT
stellar contract invoke \
  --id CB3PPOG4M55C2BJNMSZJQESLBJ2EM5JGJMNDX54JC4YJB33XK53NYRJ7 \
  --source stellarlend \
  --network testnet \
  -- mint \
  --to YOUR_ADDRESS \
  --name "Test NFT" \
  --uri "ipfs://test"

# Check ownership
stellar contract invoke \
  --id CB3PPOG4M55C2BJNMSZJQESLBJ2EM5JGJMNDX54JC4YJB33XK53NYRJ7 \
  --source stellarlend \
  --network testnet \
  -- owner_of \
  --token_id 0
```

### Success Criteria

✅ Wallet modal opens on click  
✅ Freighter option is visible  
✅ Connection succeeds without errors  
✅ Address displays correctly  
✅ Disconnect works properly  
✅ Reconnection works after disconnect  
✅ Page refresh maintains connection state  

### Known Issues

- **Large Bundle Size**: Stellar Wallet Kit adds ~400KB to bundle
  - Solution: Consider code splitting in production
  
- **Modal Styling**: Default modal may need custom styling
  - Solution: CSS overrides added in App.css

### Improvements Made

1. ✅ Replaced direct Freighter API with Stellar Wallet Kit
2. ✅ Added modal for wallet selection
3. ✅ Improved error handling
4. ✅ Better connection state management
5. ✅ Added custom styling for modal
6. ✅ Improved address formatting (6 chars each side)

### Next Steps

If wallet connection works:
1. Test transaction signing
2. Implement NFT minting UI
3. Add loan management interface
4. Test complete user flow

If issues persist:
1. Check browser console
2. Verify Freighter installation
3. Test with different browsers
4. Check network connectivity
