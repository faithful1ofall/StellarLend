import React from 'react';
import { useFreighter } from '../hooks/useFreighter';

export const WalletConnect: React.FC = () => {
  const { publicKey, isConnected, isLoading, error, connect, disconnect } = useFreighter();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="wallet-section">
      {error && <div className="error">{error}</div>}
      
      {isConnected && publicKey ? (
        <>
          <span className="wallet-address">{formatAddress(publicKey)}</span>
          <button onClick={disconnect} className="secondary">
            Disconnect
          </button>
        </>
      ) : (
        <button onClick={connect} disabled={isLoading}>
          {isLoading ? 'Connecting...' : 'Connect Freighter'}
        </button>
      )}
    </div>
  );
};
