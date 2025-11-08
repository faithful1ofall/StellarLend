import { useState } from 'react';
import { useFreighter } from '../hooks/useFreighter';
import { repayLoan } from '../utils/contractInteraction';

export const RepayLoan = () => {
  const { publicKey, signTransaction } = useFreighter();
  const [nftId, setNftId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRepay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !nftId) return;

    setLoading(true);
    setMessage(null);

    try {
      const result = await repayLoan(publicKey, parseInt(nftId), signTransaction);
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: `Loan repaid successfully! Your NFT #${nftId} has been returned to your wallet.`
        });
        
        setNftId('');
      } else {
        setMessage({
          type: 'error',
          text: result.message
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to repay loan'
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
          {message.text}
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
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading || !publicKey}>
          {loading ? 'Processing...' : 'Repay Loan'}
        </button>
      </form>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>Important:</strong></p>
        <p>• You must repay the full borrowed amount</p>
        <p>• Your NFT will be returned immediately after repayment</p>
        <p>• Make sure you have sufficient XLM in your wallet</p>
        <p>• Confirm the transaction in your wallet to proceed</p>
      </div>
    </div>
  );
};
