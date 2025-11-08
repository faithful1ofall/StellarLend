import { useState } from 'react';
import { getLoanDetails } from '../utils/contractInteraction';

interface LoanData {
  borrower: string;
  nftId: number;
  borrowedAmount: string;
  collateralValue: string;
  timestamp: number;
  isActive: boolean;
}

export const LoanStatus = () => {
  const [nftId, setNftId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loanData, setLoanData] = useState<LoanData | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nftId) return;

    setLoading(true);
    setMessage(null);
    setLoanData(null);

    try {
      const result = await getLoanDetails(parseInt(nftId));
      
      if (result.success && result.data) {
        // Parse the loan data from ScVal
        // Note: This is a simplified parsing - actual implementation may need adjustment
        // based on the exact structure returned by the contract
        setMessage({
          type: 'success',
          text: 'Loan details retrieved successfully!'
        });
        
        // You would parse the actual loan data here
        // For now, showing a success message
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'No active loan found for this NFT ID'
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to check loan status'
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
      
      {loanData && (
        <div className="loan-item">
          <h3>Loan Details</h3>
          <p><strong>NFT ID:</strong> {loanData.nftId}</p>
          <p><strong>Borrowed Amount:</strong> {loanData.borrowedAmount} XLM</p>
          <p><strong>Collateral Value:</strong> {loanData.collateralValue} XLM</p>
          <p><strong>Status:</strong> {loanData.isActive ? 'Active' : 'Inactive'}</p>
          <p><strong>Borrower:</strong> {loanData.borrower.slice(0, 8)}...{loanData.borrower.slice(-8)}</p>
        </div>
      )}
      
      {message && (
        <div className={message.type === 'success' ? 'success' : 'error'}>
          {message.text}
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
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Check Loan Status'}
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
