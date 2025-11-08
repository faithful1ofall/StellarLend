# StellarLend - NFT-Collateralized Lending on Stellar

![StellarLend Banner](https://via.placeholder.com/1200x300/667eea/ffffff?text=StellarLend+-+NFT+Collateralized+Lending)

## 🌟 Overview

StellarLend is a decentralized NFT-collateralized lending platform built on the Stellar blockchain using the Scaffold Stellar framework. Users can mint NFTs, deposit them as collateral, and borrow XLM based on a 70% loan-to-value (LTV) ratio determined by oracle-provided floor prices.

## 🎯 Features

- **NFT Minting**: Create sample NFTs with custom metadata
- **Collateralized Lending**: Deposit NFTs as collateral to borrow XLM
- **Oracle Price Feeds**: Real-time floor price data for accurate valuations
- **70% LTV Ratio**: Borrow up to 70% of your NFT's floor price value
- **Loan Repayment**: Repay loans to reclaim your NFTs
- **Liquidation Protection**: Automatic liquidation when collateral value drops below threshold
- **Modern UI**: Clean, responsive React interface with Freighter wallet integration

## 🏗️ Architecture

### Smart Contracts

#### 1. NFTContract
Manages NFT minting, ownership, and transfers.

**Key Functions:**
- `initialize(admin)` - Initialize the contract
- `mint(to, name, uri)` - Mint a new NFT
- `transfer(from, to, token_id)` - Transfer NFT ownership
- `approve(owner, spender, token_id)` - Approve address for transfer
- `owner_of(token_id)` - Get NFT owner
- `get_metadata(token_id)` - Get NFT metadata

#### 2. OracleContract
Provides NFT floor price data for loan calculations.

**Key Functions:**
- `initialize(admin, initial_price)` - Initialize oracle
- `update_price(updater, new_price)` - Update floor price (authorized only)
- `get_price()` - Get current floor price
- `add_updater(admin, updater)` - Add authorized price updater
- `is_updater(address)` - Check if address is authorized

#### 3. VaultContract
Core lending logic - handles collateral, borrowing, repayment, and liquidation.

**Key Functions:**
- `initialize(admin, nft_contract, oracle_contract)` - Initialize vault
- `deposit_and_borrow(borrower, nft_id)` - Deposit NFT and borrow XLM
- `repay(borrower, nft_id)` - Repay loan and reclaim NFT
- `liquidate(liquidator, nft_id)` - Liquidate undercollateralized loan
- `get_loan(nft_id)` - Get loan details
- `is_liquidatable(nft_id)` - Check if loan can be liquidated

## 📦 Deployed Contracts (Testnet)

| Contract | Address |
|----------|---------|
| **NFT Contract** | `CB3PPOG4M55C2BJNMSZJQESLBJ2EM5JGJMNDX54JC4YJB33XK53NYRJ7` |
| **Oracle Contract** | `CCWPINGCANTP5BXIXDVYXIMLXVPQA55NHADDYFPA25VMYPNLDUJCIDZ3` |
| **Vault Contract** | `CANZYX3QB2ATSK7WP5YODMQP24WZ4HO4YROCKNZMPIMXEKA2TDIBLUHO` |
| **Deployer** | `GBZSACFWLF7O4CZ53ZLXC7SOH7PLLFRJWK2W2UYKCWQGV6JVEF3PDFA2` |

## 🚀 Getting Started

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (1.91.0 or later)
- [Node.js](https://nodejs.org/) (v18 or later)
- [Stellar CLI](https://github.com/stellar/stellar-cli)
- [Freighter Wallet](https://www.freighter.app/) browser extension

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/faithful1ofall/StellarLend.git
cd StellarLend
```

2. **Install Rust dependencies and build contracts**
```bash
# Add wasm target
rustup target add wasm32-unknown-unknown

# Build all contracts
cargo build --target wasm32-unknown-unknown --release

# Optimize contracts
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/nft_contract.wasm
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/oracle_contract.wasm
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/vault_contract.wasm
```

3. **Install frontend dependencies**
```bash
npm install
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173` and connect your Freighter wallet.

## 🎮 Usage

### 1. Connect Wallet
Click "Connect Freighter" to connect your Stellar wallet. Make sure you're on the Testnet network.

### 2. Mint an NFT
- Enter a name and metadata URI for your NFT
- Click "Mint NFT"
- Approve the transaction in Freighter

### 3. Borrow XLM
- Select an NFT from your collection
- View the floor price and maximum borrow amount (70% LTV)
- Click "Deposit & Borrow"
- Approve both the NFT approval and borrow transactions

### 4. Manage Loans
- View your active loans in the "My Loans" section
- Monitor loan health factors
- Repay loans to reclaim your NFTs

### 5. Liquidation
- Loans become liquidatable when collateral value drops below 80% of borrowed amount
- Anyone can liquidate undercollateralized positions

## 🛠️ Development

### Project Structure

```
StellarLend/
├── contracts/              # Rust smart contracts
│   ├── nft_contract/      # NFT contract
│   ├── oracle_contract/   # Price oracle
│   └── vault_contract/    # Lending vault
├── packages/              # TypeScript contract clients
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── hooks/            # React hooks
│   └── utils/            # Utility functions
├── target/               # Compiled contracts
├── Cargo.toml           # Rust workspace config
├── package.json         # Node.js dependencies
└── vite.config.ts       # Vite configuration
```

### Building Contracts

```bash
# Build all contracts
cargo build --target wasm32-unknown-unknown --release

# Or use the build script
./build.sh
```

### Running Tests

```bash
# Run Rust contract tests
cargo test

# Run frontend tests (if implemented)
npm test
```

### Deploying to Testnet

```bash
# Generate a new identity
stellar keys generate --global myidentity --network testnet

# Fund the account
stellar keys fund myidentity --network testnet

# Deploy contracts
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/nft_contract.optimized.wasm \
  --source myidentity \
  --network testnet

# Initialize contracts
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source myidentity \
  --network testnet \
  -- initialize --admin <YOUR_ADDRESS>
```

## 🔐 Security Considerations

- **Authorization**: All sensitive operations require caller authentication
- **Reentrancy Protection**: Contracts follow checks-effects-interactions pattern
- **Integer Overflow**: Uses checked arithmetic throughout
- **Price Manipulation**: Oracle supports multiple authorized updaters
- **NFT Ownership**: Strict ownership verification before operations

## 📊 Technical Details

### Loan Parameters
- **LTV Ratio**: 70% (borrow up to 70% of NFT floor price)
- **Liquidation Threshold**: 80% (liquidation triggered when collateral < 80% of loan)
- **Price Unit**: Stroops (1 XLM = 10,000,000 stroops)

### Contract Interactions
1. User mints NFT via NFTContract
2. User approves VaultContract to transfer NFT
3. VaultContract queries OracleContract for floor price
4. VaultContract calculates 70% LTV and transfers XLM to user
5. VaultContract holds NFT as collateral
6. User repays loan to reclaim NFT
7. Liquidators can claim NFT if loan becomes undercollateralized

## 🎥 Demo Video

[Link to demo video will be added]

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Scaffold Stellar](https://scaffoldstellar.org/)
- Powered by [Stellar](https://stellar.org/)
- UI inspired by modern DeFi applications
- Special thanks to the Stellar developer community

## 📞 Contact

- GitHub: [@faithful1ofall](https://github.com/faithful1ofall)
- Repository: [StellarLend](https://github.com/faithful1ofall/StellarLend)

## 🔗 Links

- [Scaffold Stellar Documentation](https://scaffoldstellar.org/)
- [Stellar Documentation](https://developers.stellar.org/)
- [Freighter Wallet](https://www.freighter.app/)
- [Stellar Laboratory](https://laboratory.stellar.org/)

---

**Built with ❤️ using Scaffold Stellar**
