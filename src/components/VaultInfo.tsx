import { CONTRACTS } from '../config';

export const VaultInfo = () => {
  return (
    <div className="card">
      <h2>
        <span className="card-icon">ℹ️</span>
        Important Information
      </h2>

      <div className="info-box" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
        <p><strong>⚠️ Vault Funding Required</strong></p>
        <p style={{ marginTop: '10px' }}>
          Before you can borrow XLM, the vault contract must be funded with XLM. 
          This is a testnet deployment, so the vault may not have sufficient funds.
        </p>
      </div>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>How to Fund the Vault (Admin Only):</strong></p>
        <ol style={{ marginLeft: '20px', marginTop: '10px', lineHeight: '1.8' }}>
          <li>Use Stellar Laboratory or CLI to send XLM to the vault contract</li>
          <li>Vault Address: <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>{CONTRACTS.VAULT_CONTRACT}</code></li>
          <li>Recommended amount: 1000+ XLM for testing</li>
        </ol>
      </div>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>Using Stellar CLI to Fund:</strong></p>
        <code style={{ 
          display: 'block', 
          marginTop: '10px', 
          padding: '10px',
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '8px',
          fontSize: '12px',
          wordBreak: 'break-all'
        }}>
          stellar contract invoke \<br/>
          &nbsp;&nbsp;--id {CONTRACTS.VAULT_CONTRACT} \<br/>
          &nbsp;&nbsp;--source YOUR_KEY \<br/>
          &nbsp;&nbsp;--network testnet \<br/>
          &nbsp;&nbsp;-- transfer \<br/>
          &nbsp;&nbsp;--from YOUR_ADDRESS \<br/>
          &nbsp;&nbsp;--to {CONTRACTS.VAULT_CONTRACT} \<br/>
          &nbsp;&nbsp;--amount 10000000000
        </code>
        <p style={{ marginTop: '10px', fontSize: '13px', color: '#94a3b8' }}>
          Note: Amount is in stroops (10,000,000,000 = 1000 XLM)
        </p>
      </div>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <p><strong>Alternative: Use Stellar Laboratory</strong></p>
        <p style={{ marginTop: '10px' }}>
          1. Visit <a 
            href="https://laboratory.stellar.org/#?network=test" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#a855f7', textDecoration: 'none' }}
          >
            Stellar Laboratory
          </a>
        </p>
        <p>2. Create a payment operation to the vault address</p>
        <p>3. Sign and submit the transaction</p>
      </div>

      <div className="info-box" style={{ marginTop: '20px', background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
        <p><strong>✅ Once Funded:</strong></p>
        <p style={{ marginTop: '10px' }}>
          After the vault is funded, you'll be able to:
        </p>
        <ul style={{ marginLeft: '20px', marginTop: '10px', lineHeight: '1.8' }}>
          <li>Deposit NFTs as collateral</li>
          <li>Borrow up to 70% of NFT floor price</li>
          <li>Repay loans to reclaim NFTs</li>
        </ul>
      </div>
    </div>
  );
};
