# StellarLend Demo Guide

## Demo Video Script

### Introduction (30 seconds)
"Welcome to StellarLend, an NFT-collateralized lending platform built on Stellar using the Scaffold Stellar framework. In this demo, I'll show you how to mint NFTs, use them as collateral, and borrow XLM."

### Part 1: Architecture Overview (1 minute)
1. Show the architecture diagram
2. Explain the three smart contracts:
   - **NFTContract**: Manages NFT minting and ownership
   - **OracleContract**: Provides floor price data
   - **VaultContract**: Handles lending, borrowing, and liquidation
3. Highlight key features:
   - 70% LTV ratio
   - Oracle-based pricing
   - Automatic liquidation protection

### Part 2: Frontend Demo (2 minutes)
1. Open the frontend: [https://5173--019a64ef-3380-7614-b217-b77d02dc2136.eu-central-1-01.gitpod.dev](https://5173--019a64ef-3380-7614-b217-b77d02dc2136.eu-central-1-01.gitpod.dev)
2. Show the welcome screen
3. Connect Freighter wallet
4. Display contract addresses
5. Show CLI command examples

### Part 3: CLI Interaction (3 minutes)

#### Mint an NFT
```bash
stellar contract invoke \
  --id CB3PPOG4M55C2BJNMSZJQESLBJ2EM5JGJMNDX54JC4YJB33XK53NYRJ7 \
  --source stellarlend \
  --network testnet \
  -- mint \
  --to GBZSACFWLF7O4CZ53ZLXC7SOH7PLLFRJWK2W2UYKCWQGV6JVEF3PDFA2 \
  --name "Demo NFT" \
  --uri "ipfs://demo"
```

#### Check Floor Price
```bash
stellar contract invoke \
  --id CCWPINGCANTP5BXIXDVYXIMLXVPQA55NHADDYFPA25VMYPNLDUJCIDZ3 \
  --source stellarlend \
  --network testnet \
  -- get_price
```

#### Calculate Borrow Amount
```bash
stellar contract invoke \
  --id CANZYX3QB2ATSK7WP5YODMQP24WZ4HO4YROCKNZMPIMXEKA2TDIBLUHO \
  --source stellarlend \
  --network testnet \
  -- calculate_borrow_amount \
  --nft_id 0
```

#### Approve Vault
```bash
stellar contract invoke \
  --id CB3PPOG4M55C2BJNMSZJQESLBJ2EM5JGJMNDX54JC4YJB33XK53NYRJ7 \
  --source stellarlend \
  --network testnet \
  -- approve \
  --owner GBZSACFWLF7O4CZ53ZLXC7SOH7PLLFRJWK2W2UYKCWQGV6JVEF3PDFA2 \
  --spender CANZYX3QB2ATSK7WP5YODMQP24WZ4HO4YROCKNZMPIMXEKA2TDIBLUHO \
  --token_id 0
```

### Part 4: Code Walkthrough (2 minutes)
1. Show the contract structure in VS Code
2. Highlight key functions:
   - `NFTContract::mint()`
   - `OracleContract::get_price()`
   - `VaultContract::deposit_and_borrow()`
3. Explain the security features:
   - Authorization checks
   - Ownership verification
   - Liquidation logic

### Part 5: Testing (1 minute)
1. Run the demo script: `./demo-flow.sh`
2. Show successful execution
3. Verify contract interactions

### Conclusion (30 seconds)
"StellarLend demonstrates the power of Scaffold Stellar for building production-ready dApps. All contracts are deployed on Stellar Testnet, and the code is open source on GitHub. Thank you for watching!"

## Recording Tips

1. **Screen Setup**:
   - Terminal on left
   - Browser on right
   - VS Code for code walkthrough

2. **Audio**:
   - Use a good microphone
   - Minimize background noise
   - Speak clearly and at a moderate pace

3. **Visuals**:
   - Use screen recording software (OBS, Loom, etc.)
   - Highlight important sections
   - Zoom in on code when needed

4. **Editing**:
   - Add captions for contract addresses
   - Include timestamps in description
   - Add links to GitHub and deployed contracts

## Demo Checklist

- [ ] Contracts deployed and initialized
- [ ] Frontend running and accessible
- [ ] Freighter wallet installed and funded
- [ ] Demo script tested
- [ ] Screen recording software ready
- [ ] Microphone tested
- [ ] Browser tabs prepared
- [ ] Terminal commands ready
- [ ] Code examples highlighted

## Post-Demo

After recording:
1. Upload to YouTube/Vimeo
2. Add video link to README.md
3. Share on social media
4. Submit to Stellar community channels

## Contract Addresses (Testnet)

- **NFT Contract**: `CB3PPOG4M55C2BJNMSZJQESLBJ2EM5JGJMNDX54JC4YJB33XK53NYRJ7`
- **Oracle Contract**: `CCWPINGCANTP5BXIXDVYXIMLXVPQA55NHADDYFPA25VMYPNLDUJCIDZ3`
- **Vault Contract**: `CANZYX3QB2ATSK7WP5YODMQP24WZ4HO4YROCKNZMPIMXEKA2TDIBLUHO`
- **Deployer**: `GBZSACFWLF7O4CZ53ZLXC7SOH7PLLFRJWK2W2UYKCWQGV6JVEF3PDFA2`

## Resources

- Frontend: [https://5173--019a64ef-3380-7614-b217-b77d02dc2136.eu-central-1-01.gitpod.dev](https://5173--019a64ef-3380-7614-b217-b77d02dc2136.eu-central-1-01.gitpod.dev)
- GitHub: [https://github.com/faithful1ofall/StellarLend](https://github.com/faithful1ofall/StellarLend)
- Scaffold Stellar: [https://scaffoldstellar.org](https://scaffoldstellar.org)
- Stellar Docs: [https://developers.stellar.org](https://developers.stellar.org)
