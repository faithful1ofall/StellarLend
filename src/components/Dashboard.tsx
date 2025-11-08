import { useState, useEffect } from 'react';
import { useFreighter } from '../hooks/useFreighter';
import { getVaultConfig } from '../utils/contractInteraction';

export const Dashboard = () => {
  const { publicKey } = useFreighter();
  const [config, setConfig] = useState<{
    ltvRatio: number;
    liquidationThreshold: number;
  } | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const result = await getVaultConfig();
      if (result.success && result.data) {
        // Parse config data - this is simplified
        setConfig({
          ltvRatio: 70,
          liquidationThreshold: 80,
        });
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="card">
      <h2>
        <span className="card-icon">📊</span>
        Dashboard
      </h2>

      {publicKey && (
        <div className="info-box" style={{ marginBottom: '20px' }}>
          <p><strong>Connected Wallet:</strong></p>
          <p style={{ fontFamily: 'monospace', fontSize: '14px' }}>{formatAddress(publicKey)}</p>
        </div>
      )}

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
        <div className="stat-card">
          <h3>Loan-to-Value</h3>
          <p>{config?.ltvRatio || 70}%</p>
        </div>
        <div className="stat-card">
          <h3>Liquidation Threshold</h3>
          <p>{config?.liquidationThreshold || 80}%</p>
        </div>
      </div>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>How to Use StellarLend:</strong></p>
        <ol style={{ marginLeft: '20px', marginTop: '10px', lineHeight: '1.8' }}>
          <li>Mint an NFT or use an existing one</li>
          <li>Check the current floor price</li>
          <li>Calculate how much you can borrow</li>
          <li>Deposit your NFT and borrow XLM</li>
          <li>Repay your loan to reclaim your NFT</li>
        </ol>
      </div>

      <div className="info-box" style={{ marginTop: '15px' }}>
        <p><strong>Important Notes:</strong></p>
        <p>• All transactions require wallet confirmation</p>
        <p>• Monitor your loan health regularly</p>
        <p>• Repay before liquidation threshold is reached</p>
        <p>• Network: Stellar Testnet</p>
      </div>
    </div>
  );
};
