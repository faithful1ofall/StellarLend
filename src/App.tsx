import './App.css';
import { WalletConnect } from './components/WalletConnect';
import { useFreighter } from './hooks/useFreighter';
import { CONTRACTS } from './config';

function App() {
  const { isConnected } = useFreighter();

  return (
    <div className="app">
      <header className="header">
        <h1>🌟 StellarLend</h1>
        <WalletConnect />
      </header>

      {!isConnected ? (
        <div className="card">
          <h2>Welcome to StellarLend</h2>
          <p style={{ marginBottom: '20px', color: '#6b7280' }}>
            StellarLend is an NFT-collateralized lending platform on Stellar. 
            Connect your Freighter wallet to get started!
          </p>
          <div className="info-box">
            <p><strong>Features:</strong></p>
            <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
              <li>Mint sample NFTs</li>
              <li>Use NFTs as collateral to borrow XLM</li>
              <li>70% Loan-to-Value ratio</li>
              <li>Repay loans to reclaim your NFTs</li>
              <li>Automatic liquidation protection</li>
            </ul>
          </div>
          <div className="info-box" style={{ marginTop: '20px' }}>
            <p><strong>How to Use:</strong></p>
            <ol style={{ marginLeft: '20px', marginTop: '10px' }}>
              <li>Install Freighter wallet extension</li>
              <li>Switch to Stellar Testnet</li>
              <li>Fund your account from the testnet faucet</li>
              <li>Connect your wallet above</li>
              <li>Use Stellar CLI to interact with contracts</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="main-content">
          <div className="card">
            <h2>Contract Addresses</h2>
            <div className="info-box">
              <p><strong>NFT Contract:</strong></p>
              <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>{CONTRACTS.NFT_CONTRACT}</code>
            </div>
            <div className="info-box">
              <p><strong>Oracle Contract:</strong></p>
              <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>{CONTRACTS.ORACLE_CONTRACT}</code>
            </div>
            <div className="info-box">
              <p><strong>Vault Contract:</strong></p>
              <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>{CONTRACTS.VAULT_CONTRACT}</code>
            </div>
          </div>

          <div className="card">
            <h2>CLI Commands</h2>
            <div className="info-box">
              <p><strong>Mint NFT:</strong></p>
              <code style={{ fontSize: '10px', display: 'block', marginTop: '5px' }}>
                stellar contract invoke --id {CONTRACTS.NFT_CONTRACT} --source YOUR_KEY --network testnet -- mint --to YOUR_ADDRESS --name "My NFT" --uri "ipfs://..."
              </code>
            </div>
            <div className="info-box">
              <p><strong>Check Floor Price:</strong></p>
              <code style={{ fontSize: '10px', display: 'block', marginTop: '5px' }}>
                stellar contract invoke --id {CONTRACTS.ORACLE_CONTRACT} --network testnet -- get_price
              </code>
            </div>
            <div className="info-box">
              <p><strong>Borrow XLM:</strong></p>
              <code style={{ fontSize: '10px', display: 'block', marginTop: '5px' }}>
                stellar contract invoke --id {CONTRACTS.VAULT_CONTRACT} --source YOUR_KEY --network testnet -- deposit_and_borrow --borrower YOUR_ADDRESS --nft_id 0
              </code>
            </div>
          </div>

          <div className="card">
            <h2>Documentation</h2>
            <p style={{ marginBottom: '15px', color: '#6b7280' }}>
              For detailed usage instructions, see the README.md file in the repository.
            </p>
            <a 
              href="https://github.com/faithful1ofall/StellarLend" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#667eea', 
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              View on GitHub →
            </a>
          </div>
        </div>
      )}

      <footer style={{ 
        textAlign: 'center', 
        marginTop: '40px', 
        padding: '20px',
        color: 'white',
        opacity: 0.8
      }}>
        <p>Built with Scaffold Stellar | Testnet Deployment</p>
        <p style={{ fontSize: '12px', marginTop: '10px' }}>
          Network: Stellar Testnet | Framework: Scaffold Stellar
        </p>
      </footer>
    </div>
  );
}

export default App;
