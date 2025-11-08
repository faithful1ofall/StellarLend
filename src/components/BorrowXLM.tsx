import { useState } from 'react';
import { useFreighter } from '../hooks/useFreighter';
import { CONTRACTS } from '../config';

export const BorrowXLM = () => {
  const { publicKey } = useFreighter();
  const [nftId, setNftId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !nftId) return;

    setLoading(true);
    setMessage(null);

    try {
      setMessage({
        type: 'success',
        text: `To borrow XLM using your NFT as collateral, run this command:\n\nstellar contract invoke --id ${CONTRACTS.VAULT_CONTRACT} --source YOUR_KEY --network testnet -- deposit_and_borrow --borrower ${publicKey} --nft_id ${nftId}`
      });
      
      setNftId('');
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to generate borrow command'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>
        <span className="card-icon">🏦</span>
        Borrow XLM
      </h2>
      
      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'}>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '12px' }}>
            {message.text}
          </pre>
        </div>
      )}

      <form onSubmit={handleBorrow}>
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

        <button type="submit" disabled={loading || !publicKey}>
          {loading ? 'Generating...' : 'Generate Borrow Command'}
        </button>
      </form>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>Loan Terms:</strong></p>
        <p>• Loan-to-Value: 70% of NFT floor price</p>
        <p>• Liquidation Threshold: 80% collateralization</p>
        <p>• Your NFT will be held as collateral until repayment</p>
      </div>
    </div>
  );
};
