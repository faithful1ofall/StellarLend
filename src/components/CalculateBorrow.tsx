import { useState } from 'react';
import { CONTRACTS } from '../config';

export const CalculateBorrow = () => {
  const [nftId, setNftId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nftId) return;

    setLoading(true);
    setMessage(null);

    try {
      setMessage({
        type: 'success',
        text: `To calculate how much you can borrow against your NFT, run this command:\n\nstellar contract invoke --id ${CONTRACTS.VAULT_CONTRACT} --network testnet -- calculate_borrow_amount --nft_id ${nftId}`
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to generate calculation command'
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
      
      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'}>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '12px' }}>
            {message.text}
          </pre>
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
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Calculate Command'}
        </button>
      </form>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>Calculation Details:</strong></p>
        <p>• Based on current oracle floor price</p>
        <p>• Maximum borrow = Floor Price × 70%</p>
        <p>• Amount returned in stroops</p>
        <p>• To convert: divide by 10,000,000 for XLM</p>
      </div>
    </div>
  );
};
