#!/bin/bash
# StellarLend Demo Flow
# This script demonstrates the complete user flow on Stellar Testnet

set -e

echo "🌟 StellarLend Demo Flow"
echo "========================"
echo ""

# Contract addresses
NFT_CONTRACT="CB3PPOG4M55C2BJNMSZJQESLBJ2EM5JGJMNDX54JC4YJB33XK53NYRJ7"
ORACLE_CONTRACT="CCWPINGCANTP5BXIXDVYXIMLXVPQA55NHADDYFPA25VMYPNLDUJCIDZ3"
VAULT_CONTRACT="CANZYX3QB2ATSK7WP5YODMQP24WZ4HO4YROCKNZMPIMXEKA2TDIBLUHO"
IDENTITY="stellarlend"
ADDRESS="GBZSACFWLF7O4CZ53ZLXC7SOH7PLLFRJWK2W2UYKCWQGV6JVEF3PDFA2"

echo "📋 Step 1: Check Oracle Floor Price"
echo "-----------------------------------"
FLOOR_PRICE=$(stellar contract invoke \
  --id $ORACLE_CONTRACT \
  --source $IDENTITY \
  --network testnet \
  -- get_price)
echo "Floor Price: $FLOOR_PRICE stroops ($(echo "scale=2; $FLOOR_PRICE / 10000000" | bc) XLM)"
echo ""

echo "🎨 Step 2: Mint NFT"
echo "-------------------"
NFT_ID=$(stellar contract invoke \
  --id $NFT_CONTRACT \
  --source $IDENTITY \
  --network testnet \
  -- mint \
  --to $ADDRESS \
  --name "Demo NFT" \
  --uri "ipfs://QmDemo123")
echo "Minted NFT ID: $NFT_ID"
echo ""

echo "🔍 Step 3: Verify NFT Ownership"
echo "--------------------------------"
OWNER=$(stellar contract invoke \
  --id $NFT_CONTRACT \
  --source $IDENTITY \
  --network testnet \
  -- owner_of \
  --token_id $NFT_ID)
echo "NFT Owner: $OWNER"
echo ""

echo "💰 Step 4: Calculate Max Borrow Amount"
echo "---------------------------------------"
MAX_BORROW=$(stellar contract invoke \
  --id $VAULT_CONTRACT \
  --source $IDENTITY \
  --network testnet \
  -- calculate_borrow_amount \
  --nft_id $NFT_ID)
echo "Max Borrow (70% LTV): $MAX_BORROW stroops ($(echo "scale=2; $MAX_BORROW / 10000000" | bc) XLM)"
echo ""

echo "✅ Step 5: Approve Vault to Transfer NFT"
echo "-----------------------------------------"
stellar contract invoke \
  --id $NFT_CONTRACT \
  --source $IDENTITY \
  --network testnet \
  -- approve \
  --owner $ADDRESS \
  --spender $VAULT_CONTRACT \
  --token_id $NFT_ID
echo "Vault approved to transfer NFT #$NFT_ID"
echo ""

echo "🏦 Step 6: Deposit NFT and Borrow XLM"
echo "--------------------------------------"
echo "Note: This step requires the vault to have XLM balance"
echo "In production, the vault would be funded by lenders"
echo ""

echo "📊 Step 7: Check Vault Configuration"
echo "-------------------------------------"
CONFIG=$(stellar contract invoke \
  --id $VAULT_CONTRACT \
  --source $IDENTITY \
  --network testnet \
  -- get_config)
echo "Vault Config: $CONFIG"
echo "  - NFT Contract: $(echo $CONFIG | jq -r '.[0]')"
echo "  - Oracle Contract: $(echo $CONFIG | jq -r '.[1]')"
echo "  - LTV Ratio: $(echo $CONFIG | jq -r '.[2]')%"
echo "  - Liquidation Threshold: $(echo $CONFIG | jq -r '.[3]')%"
echo ""

echo "✨ Demo Complete!"
echo "================"
echo ""
echo "Summary:"
echo "  - NFT Contract: $NFT_CONTRACT"
echo "  - Oracle Contract: $ORACLE_CONTRACT"
echo "  - Vault Contract: $VAULT_CONTRACT"
echo "  - Minted NFT ID: $NFT_ID"
echo "  - Floor Price: $(echo "scale=2; $FLOOR_PRICE / 10000000" | bc) XLM"
echo "  - Max Borrow: $(echo "scale=2; $MAX_BORROW / 10000000" | bc) XLM"
echo ""
echo "🌐 Frontend: https://5173--019a64ef-3380-7614-b217-b77d02dc2136.eu-central-1-01.gitpod.dev"
echo "📚 GitHub: https://github.com/faithful1ofall/StellarLend"
