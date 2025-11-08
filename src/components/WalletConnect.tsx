import { useFreighter } from '../hooks/useFreighter';

export const WalletConnect = () => {
  const { publicKey, isConnected, isLoading, error, connect, disconnect } = useFreighter();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <div className="wallet-section">
      {error && <div className="error" style={{ marginBottom: '10px' }}>{error}</div>}
      
      {isConnected && publicKey ? (
        <>
          <span className="wallet-address" title={publicKey}>
            {formatAddress(publicKey)}
          </span>
          <button onClick={disconnect} className="secondary">
            Disconnect
          </button>
        </>
      ) : (
        <button onClick={connect} disabled={isLoading}>
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
};
