import { useState } from 'react';
import { getFloorPrice, stroopsToXLM, scValToBigInt } from '../utils/contractInteraction';

export const CheckPrice = () => {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCheckPrice = async () => {
    setLoading(true);
    setMessage(null);
    setPrice(null);

    try {
      const result = await getFloorPrice();
      
      if (result.success && result.data) {
        const priceInStroops = scValToBigInt(result.data);
        const priceInXLM = stroopsToXLM(priceInStroops);
        setPrice(priceInXLM);
        setMessage({
          type: 'success',
          text: `Current NFT floor price: ${priceInXLM} XLM (${priceInStroops.toLocaleString()} stroops)`
        });
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'Failed to fetch floor price'
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to check floor price'
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
      
      {price && (
        <div className="stat-card" style={{ marginBottom: '20px' }}>
          <h3>Current Floor Price</h3>
          <p>{price} XLM</p>
        </div>
      )}
      
      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'}>
          {message.text}
        </div>
      )}

      <button onClick={handleCheckPrice} disabled={loading}>
        {loading ? 'Checking...' : 'Check Floor Price'}
      </button>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>About Floor Price:</strong></p>
        <p>• The oracle maintains the current NFT collection floor price</p>
        <p>• Your loan amount is calculated as 70% of this price</p>
        <p>• Price updates are managed by authorized oracle updaters</p>
      </div>
    </div>
  );
};
