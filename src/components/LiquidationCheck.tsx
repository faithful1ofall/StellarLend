import { useState } from 'react';
import { CONTRACTS } from '../config';

export const LiquidationCheck = () => {
  const [nftId, setNftId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCheckLiquidation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nftId) return;

    setLoading(true);
    setMessage(null);

    try {
      setMessage({
        type: 'success',
        text: `To check if your loan is at risk of liquidation, run this command:\n\nstellar contract invoke --id ${CONTRACTS.VAULT_CONTRACT} --network testnet -- is_liquidatable --nft_id ${nftId}`
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to generate liquidation check command'
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
      
      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'}>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '12px' }}>
            {message.text}
          </pre>
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
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Liquidation Check Command'}
        </button>
      </form>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>Liquidation Protection:</strong></p>
        <p>• Loans are liquidatable when collateral value drops below 80% of borrowed amount</p>
        <p>• Returns <code>true</code> if loan can be liquidated</p>
        <p>• Returns <code>false</code> if loan is safe or doesn't exist</p>
        <p>• Monitor your loan regularly to avoid liquidation</p>
      </div>
    </div>
  );
};
