import { useState } from 'react';
import { CONTRACTS } from '../config';

export const LoanStatus = () => {
  const [nftId, setNftId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nftId) return;

    setLoading(true);
    setMessage(null);

    try {
      setMessage({
        type: 'success',
        text: `To check the status of your loan, run this command:\n\nstellar contract invoke --id ${CONTRACTS.VAULT_CONTRACT} --network testnet -- get_loan --nft_id ${nftId}`
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to generate status check command'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>
        <span className="card-icon">🔍</span>
        Check Loan Status
      </h2>
      
      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'}>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '12px' }}>
            {message.text}
          </pre>
        </div>
      )}

      <form onSubmit={handleCheckStatus}>
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
          {loading ? 'Generating...' : 'Generate Status Check Command'}
        </button>
      </form>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>Loan Information Includes:</strong></p>
        <p>• Borrower address</p>
        <p>• NFT ID used as collateral</p>
        <p>• Borrowed amount</p>
        <p>• Collateral value at time of borrowing</p>
        <p>• Loan timestamp</p>
        <p>• Active status</p>
      </div>
    </div>
  );
};
