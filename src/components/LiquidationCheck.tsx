import { useState } from 'react';
import { checkLiquidation } from '../utils/contractInteraction';

export const LiquidationCheck = () => {
  const [nftId, setNftId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLiquidatable, setIsLiquidatable] = useState<boolean | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  const handleCheckLiquidation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nftId) return;

    setLoading(true);
    setMessage(null);
    setIsLiquidatable(null);

    try {
      const result = await checkLiquidation(parseInt(nftId));
      
      if (result.success && result.data !== undefined) {
        const liquidatable = result.data === true || result.data.toString() === 'true';
        setIsLiquidatable(liquidatable);
        
        if (liquidatable) {
          setMessage({
            type: 'warning',
            text: `⚠️ WARNING: This loan is at risk of liquidation! The collateral value has fallen below the 80% threshold. Consider repaying your loan immediately.`
          });
        } else {
          setMessage({
            type: 'success',
            text: `✅ Your loan is safe! The collateral value is above the liquidation threshold.`
          });
        }
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'Failed to check liquidation status'
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to check liquidation risk'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>
        <span className="card-icon">⚠️</span>
        Check Liquidation Risk
      </h2>
      
      {isLiquidatable !== null && (
        <div className={`loan-item ${isLiquidatable ? 'danger' : ''}`} style={{ marginBottom: '20px' }}>
          <h3>Liquidation Status</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: isLiquidatable ? '#ef4444' : '#22c55e' }}>
            {isLiquidatable ? '🚨 AT RISK' : '✅ SAFE'}
          </p>
        </div>
      )}
      
      {message && (
        <div className={
          message.type === 'success' ? 'success' : 
          message.type === 'warning' ? 'error' : 'error'
        }>
          {message.text}
        </div>
      )}

      <form onSubmit={handleCheckLiquidation}>
        <div className="form-group">
          <label>NFT ID</label>
          <input
            type="number"
            value={nftId}
            onChange={(e) => setNftId(e.target.value)}
            placeholder="0"
            min="0"
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Check Liquidation Risk'}
        </button>
      </form>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>Liquidation Protection:</strong></p>
        <p>• Loans are liquidatable when collateral value drops below 80% of borrowed amount</p>
        <p>• Monitor your loan regularly to avoid liquidation</p>
        <p>• If at risk, repay your loan immediately to reclaim your NFT</p>
      </div>
    </div>
  );
};
