import { useState } from 'react';
import { useFreighter } from '../hooks/useFreighter';
import { borrowXLM, stroopsToXLM } from '../utils/contractInteraction';

export const BorrowXLM = () => {
  const { publicKey, signTransaction } = useFreighter();
  const [nftId, setNftId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !nftId) return;

    setLoading(true);
    setMessage(null);

    try {
      const result = await borrowXLM(publicKey, parseInt(nftId), signTransaction);
      
      if (result.success) {
        const borrowedAmount = result.data ? stroopsToXLM(result.data) : 'Unknown';
        setMessage({
          type: 'success',
          text: `Successfully borrowed ${borrowedAmount} XLM! Your NFT #${nftId} is now held as collateral.`
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
        text: error.message || 'Failed to borrow XLM'
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
          {message.text}
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
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading || !publicKey}>
          {loading ? 'Processing...' : 'Borrow XLM'}
        </button>
      </form>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>Loan Terms:</strong></p>
        <p>• Loan-to-Value: 70% of NFT floor price</p>
        <p>• Liquidation Threshold: 80% collateralization</p>
        <p>• Your NFT will be held as collateral until repayment</p>
        <p>• Confirm the transaction in your wallet to proceed</p>
      </div>
    </div>
  );
};
