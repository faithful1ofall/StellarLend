#!/bin/bash
set -e

echo "Building StellarLend contracts..."

# Build NFT Contract
echo "Building NFT Contract..."
cd contracts/nft_contract
cargo build --target wasm32-unknown-unknown --release
cd ../..

# Build Oracle Contract
echo "Building Oracle Contract..."
cd contracts/oracle_contract
cargo build --target wasm32-unknown-unknown --release
cd ../..

# Build Vault Contract (depends on NFT and Oracle)
echo "Building Vault Contract..."
cd contracts/vault_contract
cargo build --target wasm32-unknown-unknown --release
cd ../..

echo "✅ All contracts built successfully!"
echo ""
echo "Contract WASMs:"
echo "  - NFT: contracts/nft_contract/target/wasm32-unknown-unknown/release/nft_contract.wasm"
echo "  - Oracle: contracts/oracle_contract/target/wasm32-unknown-unknown/release/oracle_contract.wasm"
echo "  - Vault: contracts/vault_contract/target/wasm32-unknown-unknown/release/vault_contract.wasm"
