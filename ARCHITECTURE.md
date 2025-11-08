# StellarLend Architecture

## Overview
StellarLend is an NFT-collateralized lending platform on Stellar that allows users to:
1. Mint sample NFTs
2. Deposit NFTs as collateral
3. Borrow XLM at 70% LTV based on floor price
4. Repay loans to reclaim NFTs
5. Trigger liquidation when floor price drops

## Smart Contracts

### 1. NFTContract
**Purpose**: Manage NFT minting and ownership

**Storage**:
- `owner: Map<u32, Address>` - NFT ID to owner mapping
- `next_token_id: u32` - Counter for minting
- `metadata: Map<u32, String>` - NFT metadata URI
- `approved: Map<u32, Address>` - Approved addresses for transfer

**Functions**:
- `initialize(admin: Address)` - Initialize contract
- `mint(to: Address, metadata: String) -> u32` - Mint new NFT
- `transfer(from: Address, to: Address, token_id: u32)` - Transfer NFT
- `approve(spender: Address, token_id: u32)` - Approve transfer
- `owner_of(token_id: u32) -> Address` - Get NFT owner
- `get_metadata(token_id: u32) -> String` - Get NFT metadata

### 2. OracleContract
**Purpose**: Provide NFT floor price data

**Storage**:
- `admin: Address` - Oracle admin
- `floor_price: i128` - Current floor price in stroops
- `last_update: u64` - Timestamp of last update
- `authorized_updaters: Map<Address, bool>` - Authorized price updaters

**Functions**:
- `initialize(admin: Address, initial_price: i128)` - Initialize oracle
- `update_price(new_price: i128)` - Update floor price (admin only)
- `get_price() -> i128` - Get current floor price
- `add_updater(updater: Address)` - Add authorized updater
- `remove_updater(updater: Address)` - Remove updater

### 3. VaultContract
**Purpose**: Core lending logic - collateral management, borrowing, repayment, liquidation

**Storage**:
- `admin: Address` - Vault admin
- `nft_contract: Address` - NFT contract address
- `oracle_contract: Address` - Oracle contract address
- `loans: Map<u32, Loan>` - NFT ID to loan mapping
- `ltv_ratio: u32` - Loan-to-value ratio (70 = 70%)
- `liquidation_threshold: u32` - Liquidation threshold (80 = 80%)

**Loan Structure**:
```rust
struct Loan {
    borrower: Address,
    nft_id: u32,
    borrowed_amount: i128,
    collateral_value: i128,
    timestamp: u64,
    is_active: bool,
}
```

**Functions**:
- `initialize(admin: Address, nft_contract: Address, oracle_contract: Address)` - Initialize vault
- `deposit_and_borrow(nft_id: u32) -> i128` - Deposit NFT and borrow XLM
- `repay(nft_id: u32)` - Repay loan and reclaim NFT
- `liquidate(nft_id: u32)` - Liquidate undercollateralized loan
- `get_loan(nft_id: u32) -> Loan` - Get loan details
- `calculate_borrow_amount(nft_id: u32) -> i128` - Calculate max borrow amount
- `is_liquidatable(nft_id: u32) -> bool` - Check if loan can be liquidated

## Frontend Components

### 1. Wallet Connection
- Stellar Wallet Kit integration
- Connect/disconnect functionality
- Display connected address

### 2. NFT Minting
- Mint sample NFT button
- Display minted NFT with metadata
- Show NFT ownership

### 3. Collateral & Borrowing
- Select NFT to deposit
- Show floor price from oracle
- Display max borrow amount (70% LTV)
- Deposit and borrow in one transaction
- Show active loans

### 4. Loan Management
- Display active loans with details
- Repay loan button
- Show loan health (collateralization ratio)
- Warning when near liquidation

### 5. Liquidation
- Admin view to see liquidatable loans
- Liquidate button for underwater positions
- Display liquidation events

## Data Flow

1. **Minting**: User → NFTContract → Mint NFT → Return token_id
2. **Borrowing**: 
   - User approves VaultContract to transfer NFT
   - User calls deposit_and_borrow
   - VaultContract transfers NFT from user
   - VaultContract queries OracleContract for price
   - VaultContract calculates 70% LTV
   - VaultContract transfers XLM to user
   - VaultContract stores loan record
3. **Repayment**:
   - User calls repay with XLM
   - VaultContract verifies payment
   - VaultContract transfers NFT back to user
   - VaultContract marks loan as inactive
4. **Liquidation**:
   - Anyone can call liquidate
   - VaultContract checks current price vs loan
   - If underwater, NFT transferred to liquidator
   - Loan marked as liquidated

## Security Considerations

1. **Reentrancy**: Use checks-effects-interactions pattern
2. **Authorization**: Verify caller permissions for sensitive operations
3. **Price Manipulation**: Oracle should have multiple updaters and time delays
4. **Integer Overflow**: Use checked arithmetic
5. **NFT Ownership**: Verify ownership before operations
6. **Liquidation Front-running**: First-come-first-served liquidation

## Testing Strategy

1. Unit tests for each contract function
2. Integration tests for cross-contract calls
3. Frontend E2E tests with testnet
4. Manual testing of complete user flows
5. Edge cases: zero amounts, invalid NFTs, price changes
