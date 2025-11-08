import { useState, useEffect } from 'react';
import { StellarWalletsKit, WalletNetwork, allowAllModules, FREIGHTER_ID } from '@creit.tech/stellar-wallets-kit';

const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: allowAllModules(),
});

export const useFreighter = () => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { address } = await kit.getAddress();
      if (address) {
        setPublicKey(address);
      }
    } catch (err) {
      // Not connected yet, ignore error
      console.log('Wallet not connected yet');
    }
  };

  const connect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await kit.openModal({
        onWalletSelected: async (option) => {
          kit.setWallet(option.id);
          const { address } = await kit.getAddress();
          setPublicKey(address);
        }
      });
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Error connecting wallet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setPublicKey(null);
  };

  const signTransaction = async (xdr: string, opts?: any) => {
    try {
      const { signedTxXdr } = await kit.signTransaction(xdr, {
        networkPassphrase: opts?.networkPassphrase || 'Test SDF Network ; September 2015',
      });
      return signedTxXdr;
    } catch (err) {
      console.error('Error signing transaction:', err);
      throw err;
    }
  };

  return {
    publicKey,
    isConnected: !!publicKey,
    isLoading,
    error,
    connect,
    disconnect,
    signTransaction,
    kit,
  };
};
