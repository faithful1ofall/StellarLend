import { useState } from 'react';
import { useFreighter } from '../hooks/useFreighter';
import { CONTRACTS } from '../config';

export const RepayLoan = () => {
  const { publicKey } = useFreighter();
  const [nftId, setNftId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRepay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !nftId) return;

    setLoading(true);
    setMessage(null);

    try {
      setMessage({
        type: 'success',
        text: `To repay your loan and reclaim your NFT, run this command:\n\nstellar contract invoke --id ${CONTRACTS.VAULT_CONTRACT} --source YOUR_KEY --network testnet -- repay --borrower ${publicKey} --nft_id ${nftId}`
      });
      
      setNftId('');
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to generate repay command'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>
        <span className="card-icon">💳</span>
        Repay Loan
      </h2>
      
      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'}>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '12px' }}>
            {message.text}
          </pre>
        </div>
      )}

      <form onSubmit={handleRepay}>
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
          {loading ? 'Generating...' : 'Generate Repay Command'}
        </button>
      </form>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>Important:</strong></p>
        <p>• You must repay the full borrowed amount</p>
        <p>• Your NFT will be returned immediately after repayment</p>
        <p>• Make sure you have sufficient XLM in your wallet</p>
      </div>
    </div>
  );
};
