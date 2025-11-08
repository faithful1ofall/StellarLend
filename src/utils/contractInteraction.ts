import * as StellarSdk from '@stellar/stellar-sdk';
import { CONTRACTS, NETWORK } from '../config';

const server = new StellarSdk.rpc.Server(NETWORK.rpcUrl);

export interface TransactionResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Build and submit a contract transaction
 */
export async function buildAndSubmitTransaction(
  publicKey: string,
  contractId: string,
  method: string,
  params: StellarSdk.xdr.ScVal[],
  signTransaction: (xdr: string) => Promise<string>
): Promise<TransactionResult> {
  try {
    // Load account
    const account = await server.getAccount(publicKey);
    
    // Build contract operation
    const contract = new StellarSdk.Contract(contractId);
    const operation = contract.call(method, ...params);

    // Build transaction
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK.networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    // Simulate transaction
    const simulated = await server.simulateTransaction(transaction);
    
    if (StellarSdk.rpc.Api.isSimulationError(simulated)) {
      throw new Error(`Simulation failed: ${simulated.error}`);
    }

    // Prepare transaction with simulation results
    const preparedTransaction = StellarSdk.rpc.assembleTransaction(
      transaction,
      simulated
    ).build();

    // Sign transaction
    const signedXdr = await signTransaction(preparedTransaction.toXDR());
    const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK.networkPassphrase
    );

    // Submit transaction
    const result = await server.sendTransaction(signedTransaction as StellarSdk.Transaction);

    // Wait for confirmation
    let status = await server.getTransaction(result.hash);
    let attempts = 0;
    
    while (status.status === 'NOT_FOUND' && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      status = await server.getTransaction(result.hash);
      attempts++;
    }

    if (status.status === 'SUCCESS') {
      // Parse result if available
      let returnValue;
      if (status.returnValue) {
        returnValue = status.returnValue;
      }

      return {
        success: true,
        message: 'Transaction successful!',
        data: returnValue,
      };
    } else {
      return {
        success: false,
        message: `Transaction failed: ${status.status}`,
      };
    }
  } catch (error: any) {
    console.error('Transaction error:', error);
    return {
      success: false,
      message: error.message || 'Transaction failed',
    };
  }
}

/**
 * Read-only contract call (no transaction needed)
 */
export async function readContract(
  contractId: string,
  method: string,
  params: StellarSdk.xdr.ScVal[] = []
): Promise<TransactionResult> {
  try {
    const contract = new StellarSdk.Contract(contractId);
    
    // Create a dummy account for simulation
    const account = new StellarSdk.Account(
      'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
      '0'
    );

    const operation = contract.call(method, ...params);
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK.networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    const simulated = await server.simulateTransaction(transaction);
    
    if (StellarSdk.rpc.Api.isSimulationError(simulated)) {
      throw new Error(`Simulation failed: ${simulated.error}`);
    }

    return {
      success: true,
      message: 'Read successful',
      data: simulated.result?.retval,
    };
  } catch (error: any) {
    console.error('Read error:', error);
    return {
      success: false,
      message: error.message || 'Read failed',
    };
  }
}

/**
 * Helper to convert string to ScVal
 */
export function stringToScVal(str: string): StellarSdk.xdr.ScVal {
  return StellarSdk.nativeToScVal(str, { type: 'string' });
}

/**
 * Helper to convert number to ScVal
 */
export function numberToScVal(num: number): StellarSdk.xdr.ScVal {
  return StellarSdk.nativeToScVal(num, { type: 'u32' });
}

/**
 * Helper to convert address to ScVal
 */
export function addressToScVal(address: string): StellarSdk.xdr.ScVal {
  return new StellarSdk.Address(address).toScVal();
}

/**
 * Helper to parse ScVal to number
 */
export function scValToNumber(scVal: StellarSdk.xdr.ScVal): number {
  return StellarSdk.scValToNative(scVal);
}

/**
 * Helper to parse ScVal to string
 */
export function scValToString(scVal: StellarSdk.xdr.ScVal): string {
  return StellarSdk.scValToNative(scVal);
}

/**
 * Helper to format stroops to XLM
 */
export function stroopsToXLM(stroops: number): string {
  return (stroops / 10_000_000).toFixed(7);
}

/**
 * Helper to format XLM to stroops
 */
export function xlmToStroops(xlm: number): number {
  return Math.floor(xlm * 10_000_000);
}

// Contract-specific functions

/**
 * Mint NFT
 */
export async function mintNFT(
  publicKey: string,
  name: string,
  uri: string,
  signTransaction: (xdr: string) => Promise<string>
): Promise<TransactionResult> {
  const params = [
    addressToScVal(publicKey),
    stringToScVal(name),
    stringToScVal(uri),
  ];

  return buildAndSubmitTransaction(
    publicKey,
    CONTRACTS.NFT_CONTRACT,
    'mint',
    params,
    signTransaction
  );
}

/**
 * Get NFT floor price from oracle
 */
export async function getFloorPrice(): Promise<TransactionResult> {
  return readContract(CONTRACTS.ORACLE_CONTRACT, 'get_price');
}

/**
 * Borrow XLM using NFT as collateral
 */
export async function borrowXLM(
  publicKey: string,
  nftId: number,
  signTransaction: (xdr: string) => Promise<string>
): Promise<TransactionResult> {
  const params = [
    addressToScVal(publicKey),
    numberToScVal(nftId),
  ];

  return buildAndSubmitTransaction(
    publicKey,
    CONTRACTS.VAULT_CONTRACT,
    'deposit_and_borrow',
    params,
    signTransaction
  );
}

/**
 * Repay loan and reclaim NFT
 */
export async function repayLoan(
  publicKey: string,
  nftId: number,
  signTransaction: (xdr: string) => Promise<string>
): Promise<TransactionResult> {
  const params = [
    addressToScVal(publicKey),
    numberToScVal(nftId),
  ];

  return buildAndSubmitTransaction(
    publicKey,
    CONTRACTS.VAULT_CONTRACT,
    'repay',
    params,
    signTransaction
  );
}

/**
 * Get loan details
 */
export async function getLoanDetails(nftId: number): Promise<TransactionResult> {
  const params = [numberToScVal(nftId)];
  return readContract(CONTRACTS.VAULT_CONTRACT, 'get_loan', params);
}

/**
 * Check if loan is liquidatable
 */
export async function checkLiquidation(nftId: number): Promise<TransactionResult> {
  const params = [numberToScVal(nftId)];
  return readContract(CONTRACTS.VAULT_CONTRACT, 'is_liquidatable', params);
}

/**
 * Calculate borrow amount
 */
export async function calculateBorrowAmount(nftId: number): Promise<TransactionResult> {
  const params = [numberToScVal(nftId)];
  return readContract(CONTRACTS.VAULT_CONTRACT, 'calculate_borrow_amount', params);
}

/**
 * Get vault configuration
 */
export async function getVaultConfig(): Promise<TransactionResult> {
  return readContract(CONTRACTS.VAULT_CONTRACT, 'get_config');
}
