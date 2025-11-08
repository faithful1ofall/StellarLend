import { useState } from 'react';
import { calculateBorrowAmount, stroopsToXLM, scValToNumber } from '../utils/contractInteraction';

export const CalculateBorrow = () => {
  const [nftId, setNftId] = useState('');
  const [loading, setLoading] = useState(false);
  const [borrowAmount, setBorrowAmount] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nftId) return;

    setLoading(true);
    setMessage(null);
    setBorrowAmount(null);

    try {
      const result = await calculateBorrowAmount(parseInt(nftId));
      
      if (result.success && result.data) {
        const amountInStroops = scValToNumber(result.data);
        const amountInXLM = stroopsToXLM(amountInStroops);
        setBorrowAmount(amountInXLM);
        setMessage({
          type: 'success',
          text: `You can borrow up to ${amountInXLM} XLM using NFT #${nftId} as collateral`
        });
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'Failed to calculate borrow amount'
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to calculate borrow amount'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>
        <span className="card-icon">📊</span>
        Calculate Borrow Amount
      </h2>
      
      {borrowAmount && (
        <div className="stat-card" style={{ marginBottom: '20px' }}>
          <h3>Maximum Borrow Amount</h3>
          <p>{borrowAmount} XLM</p>
        </div>
      )}
      
      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleCalculate}>
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
          {loading ? 'Calculating...' : 'Calculate Borrow Amount'}
        </button>
      </form>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>Calculation Details:</strong></p>
        <p>• Based on current oracle floor price</p>
        <p>• Maximum borrow = Floor Price × 70%</p>
        <p>• This is the maximum amount you can borrow</p>
        <p>• Actual amount may vary based on market conditions</p>
      </div>
    </div>
  );
};
