import { useState, useEffect } from 'react';
import * as freighter from '@stellar/freighter-api';

export const useFreighter = () => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await freighter.isConnected();
      if (connected) {
        const result = await freighter.default.getAddress();
        if (result.address) {
          setPublicKey(result.address);
        }
      }
    } catch (err) {
      console.error('Error checking Freighter connection:', err);
    }
  };

  const connect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await freighter.default.getAddress();
      if (result.address) {
        setPublicKey(result.address);
      } else if (result.error) {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Error connecting to Freighter:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setPublicKey(null);
  };

  return {
    publicKey,
    isConnected: !!publicKey,
    isLoading,
    error,
    connect,
    disconnect,
    signTransaction: freighter.default.signTransaction,
  };
};
