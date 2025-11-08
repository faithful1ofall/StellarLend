import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CANZYX3QB2ATSK7WP5YODMQP24WZ4HO4YROCKNZMPIMXEKA2TDIBLUHO",
  }
} as const


export interface Loan {
  borrowed_amount: i128;
  borrower: string;
  collateral_value: i128;
  is_active: boolean;
  nft_id: u32;
  timestamp: u64;
}

export type DataKey = {tag: "Admin", values: void} | {tag: "NftContract", values: void} | {tag: "OracleContract", values: void} | {tag: "Loan", values: readonly [u32]} | {tag: "LtvRatio", values: void} | {tag: "LiquidationThreshold", values: void};

export interface Client {
  /**
   * Construct and simulate a repay transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Repay loan and reclaim NFT
   */
  repay: ({borrower, nft_id}: {borrower: string, nft_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_loan transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get loan details
   */
  get_loan: ({nft_id}: {nft_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<Loan>>>

  /**
   * Construct and simulate a liquidate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Liquidate an undercollateralized loan
   */
  liquidate: ({liquidator, nft_id}: {liquidator: string, nft_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get vault configuration
   */
  get_config: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<readonly [string, string, u32, u32]>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the vault contract
   */
  initialize: ({admin, nft_contract, oracle_contract}: {admin: string, nft_contract: string, oracle_contract: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a is_liquidatable transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Check if a loan can be liquidated
   */
  is_liquidatable: ({nft_id}: {nft_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a deposit_and_borrow transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Deposit NFT as collateral and borrow XLM
   */
  deposit_and_borrow: ({borrower, nft_id}: {borrower: string, nft_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a calculate_borrow_amount transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Calculate maximum borrow amount for an NFT
   */
  calculate_borrow_amount: ({nft_id}: {nft_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAABExvYW4AAAAGAAAAAAAAAA9ib3Jyb3dlZF9hbW91bnQAAAAACwAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAABBjb2xsYXRlcmFsX3ZhbHVlAAAACwAAAAAAAAAJaXNfYWN0aXZlAAAAAAAAAQAAAAAAAAAGbmZ0X2lkAAAAAAAEAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAG",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABgAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAALTmZ0Q29udHJhY3QAAAAAAAAAAAAAAAAOT3JhY2xlQ29udHJhY3QAAAAAAAEAAAAAAAAABExvYW4AAAABAAAABAAAAAAAAAAAAAAACEx0dlJhdGlvAAAAAAAAAAAAAAAUTGlxdWlkYXRpb25UaHJlc2hvbGQ=",
        "AAAAAAAAABpSZXBheSBsb2FuIGFuZCByZWNsYWltIE5GVAAAAAAABXJlcGF5AAAAAAAAAgAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAAZuZnRfaWQAAAAAAAQAAAAA",
        "AAAAAAAAABBHZXQgbG9hbiBkZXRhaWxzAAAACGdldF9sb2FuAAAAAQAAAAAAAAAGbmZ0X2lkAAAAAAAEAAAAAQAAA+gAAAfQAAAABExvYW4=",
        "AAAAAAAAACVMaXF1aWRhdGUgYW4gdW5kZXJjb2xsYXRlcmFsaXplZCBsb2FuAAAAAAAACWxpcXVpZGF0ZQAAAAAAAAIAAAAAAAAACmxpcXVpZGF0b3IAAAAAABMAAAAAAAAABm5mdF9pZAAAAAAABAAAAAA=",
        "AAAAAAAAABdHZXQgdmF1bHQgY29uZmlndXJhdGlvbgAAAAAKZ2V0X2NvbmZpZwAAAAAAAAAAAAEAAAPtAAAABAAAABMAAAATAAAABAAAAAQ=",
        "AAAAAAAAAB1Jbml0aWFsaXplIHRoZSB2YXVsdCBjb250cmFjdAAAAAAAAAppbml0aWFsaXplAAAAAAADAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAADG5mdF9jb250cmFjdAAAABMAAAAAAAAAD29yYWNsZV9jb250cmFjdAAAAAATAAAAAA==",
        "AAAAAAAAACFDaGVjayBpZiBhIGxvYW4gY2FuIGJlIGxpcXVpZGF0ZWQAAAAAAAAPaXNfbGlxdWlkYXRhYmxlAAAAAAEAAAAAAAAABm5mdF9pZAAAAAAABAAAAAEAAAAB",
        "AAAAAAAAAChEZXBvc2l0IE5GVCBhcyBjb2xsYXRlcmFsIGFuZCBib3Jyb3cgWExNAAAAEmRlcG9zaXRfYW5kX2JvcnJvdwAAAAAAAgAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAAZuZnRfaWQAAAAAAAQAAAABAAAACw==",
        "AAAAAAAAACpDYWxjdWxhdGUgbWF4aW11bSBib3Jyb3cgYW1vdW50IGZvciBhbiBORlQAAAAAABdjYWxjdWxhdGVfYm9ycm93X2Ftb3VudAAAAAABAAAAAAAAAAZuZnRfaWQAAAAAAAQAAAABAAAACw==" ]),
      options
    )
  }
  public readonly fromJSON = {
    repay: this.txFromJSON<null>,
        get_loan: this.txFromJSON<Option<Loan>>,
        liquidate: this.txFromJSON<null>,
        get_config: this.txFromJSON<readonly [string, string, u32, u32]>,
        initialize: this.txFromJSON<null>,
        is_liquidatable: this.txFromJSON<boolean>,
        deposit_and_borrow: this.txFromJSON<i128>,
        calculate_borrow_amount: this.txFromJSON<i128>
  }
}