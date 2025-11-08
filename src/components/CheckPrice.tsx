import { useState } from 'react';
import { CONTRACTS } from '../config';

export const CheckPrice = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCheckPrice = async () => {
    setLoading(true);
    setMessage(null);

    try {
      setMessage({
        type: 'success',
        text: `To check the current NFT floor price, run this command:\n\nstellar contract invoke --id ${CONTRACTS.ORACLE_CONTRACT} --network testnet -- get_price`
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to generate price check command'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>
        <span className="card-icon">💰</span>
        Check Floor Price
      </h2>
      
      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'}>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '12px' }}>
            {message.text}
          </pre>
        </div>
      )}

      <button onClick={handleCheckPrice} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Price Check Command'}
      </button>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>About Floor Price:</strong></p>
        <p>• The oracle maintains the current NFT collection floor price</p>
        <p>• Your loan amount is calculated as 70% of this price</p>
        <p>• Price is returned in stroops (1 XLM = 10,000,000 stroops)</p>
      </div>
    </div>
  );
};
