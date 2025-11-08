import { useState } from 'react';
import { useFreighter } from '../hooks/useFreighter';
import { mintNFT, scValToNumber } from '../utils/contractInteraction';

export const MintNFT = () => {
  const { publicKey, signTransaction } = useFreighter();
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
      const result = await mintNFT(publicKey, name, uri, signTransaction);
      
      if (result.success) {
        let tokenId = 'Check your wallet';
        if (result.data) {
          try {
            tokenId = String(scValToNumber(result.data));
          } catch (e) {
            console.error('Error parsing token ID:', e);
          }
        }
        setMessage({
          type: 'success',
          text: `NFT minted successfully! Token ID: ${tokenId}`
        });
        
        // Reset form
        setName('');
        setUri('');
      } else {
        setMessage({
          type: 'error',
          text: result.message
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to mint NFT'
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
          {message.text}
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading || !publicKey}>
          {loading ? 'Minting...' : 'Mint NFT'}
        </button>
      </form>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>How it works:</strong></p>
        <p>• Enter your NFT details above</p>
        <p>• Click "Mint NFT" to create your token</p>
        <p>• Confirm the transaction in your wallet</p>
        <p>• Your NFT will be minted on Stellar testnet</p>
      </div>
    </div>
  );
};
