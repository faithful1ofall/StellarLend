import { useState } from 'react';
import { useFreighter } from '../hooks/useFreighter';
import { CONTRACTS } from '../config';

export const MintNFT = () => {
  const { publicKey } = useFreighter();
  const [name, setName] = useState('');
  const [uri, setUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !name || !uri) return;

    setLoading(true);
    setMessage(null);

    try {
      setMessage({
        type: 'success',
        text: `To mint your NFT, run this command in your terminal:\n\nstellar contract invoke --id ${CONTRACTS.NFT_CONTRACT} --source YOUR_KEY --network testnet -- mint --to ${publicKey} --name "${name}" --uri "${uri}"`
      });
      
      // Reset form
      setName('');
      setUri('');
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to generate mint command'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>
        <span className="card-icon">🎨</span>
        Mint NFT
      </h2>
      
      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'}>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '12px' }}>
            {message.text}
          </pre>
        </div>
      )}

      <form onSubmit={handleMint}>
        <div className="form-group">
          <label>NFT Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Awesome NFT"
            required
          />
        </div>

        <div className="form-group">
          <label>Token URI</label>
          <input
            type="text"
            value={uri}
            onChange={(e) => setUri(e.target.value)}
            placeholder="ipfs://... or https://..."
            required
          />
        </div>

        <button type="submit" disabled={loading || !publicKey}>
          {loading ? 'Generating...' : 'Generate Mint Command'}
        </button>
      </form>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>Note:</strong> Copy the generated command and run it in your terminal with the Stellar CLI installed.</p>
      </div>
    </div>
  );
};
