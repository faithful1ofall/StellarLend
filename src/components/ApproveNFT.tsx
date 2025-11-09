import { useState } from 'react';
import { useFreighter } from '../hooks/useFreighter';
import { CONTRACTS } from '../config';
import { buildAndSubmitTransaction, addressToScVal, numberToScVal } from '../utils/contractInteraction';

export const ApproveNFT = () => {
  const { publicKey, signTransaction } = useFreighter();
  const [nftId, setNftId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !nftId) return;

    setLoading(true);
    setMessage(null);

    try {
      const params = [
        addressToScVal(publicKey),
        addressToScVal(CONTRACTS.VAULT_CONTRACT),
        numberToScVal(parseInt(nftId)),
      ];

      const result = await buildAndSubmitTransaction(
        publicKey,
        CONTRACTS.NFT_CONTRACT,
        'approve',
        params,
        signTransaction
      );
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: `NFT #${nftId} approved successfully! The vault can now use it as collateral.`
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
        text: error.message || 'Failed to approve NFT'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>
        <span className="card-icon">✅</span>
        Approve NFT
      </h2>
      
      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleApprove}>
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
          {loading ? 'Approving...' : 'Approve NFT'}
        </button>
      </form>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>Why Approve?</strong></p>
        <p style={{ marginTop: '10px' }}>
          Before the vault can accept your NFT as collateral, you need to approve 
          it to transfer your NFT. This is a one-time operation per NFT.
        </p>
      </div>

      <div className="info-box" style={{ marginTop: '15px' }}>
        <p><strong>Steps:</strong></p>
        <ol style={{ marginLeft: '20px', marginTop: '10px', lineHeight: '1.8' }}>
          <li>Enter your NFT ID</li>
          <li>Click "Approve NFT"</li>
          <li>Confirm in your wallet</li>
          <li>Then you can borrow using this NFT</li>
        </ol>
      </div>
    </div>
  );
};
