import './App.css';
import { WalletConnect } from './components/WalletConnect';
import { MintNFT } from './components/MintNFT';
import { BorrowXLM } from './components/BorrowXLM';
import { RepayLoan } from './components/RepayLoan';
import { CheckPrice } from './components/CheckPrice';
import { LoanStatus } from './components/LoanStatus';
import { LiquidationCheck } from './components/LiquidationCheck';
import { CalculateBorrow } from './components/CalculateBorrow';
import { useFreighter } from './hooks/useFreighter';
import { CONTRACTS } from './config';

function App() {
  const { isConnected } = useFreighter();

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">✨</span>
            <h1>StellarLend</h1>
          </div>
          <WalletConnect />
        </div>
      </header>

      {!isConnected ? (
        <>
          <section className="hero">
            <h2>
              Unlock Liquidity with <span className="gradient-text">NFT Collateral</span>
            </h2>
            <p>
              The first decentralized NFT-collateralized lending platform on Stellar. 
              Borrow XLM instantly using your NFTs as collateral with transparent, 
              on-chain pricing and automated liquidation protection.
            </p>
            <WalletConnect />
          </section>

          <section className="features">
            <h3>Why Choose StellarLend?</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h4>NFT Collateral</h4>
                <p>
                  Use your NFTs as collateral to unlock instant liquidity. 
                  Keep your assets while accessing the funds you need.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h4>Instant Loans</h4>
                <p>
                  Get up to 70% of your NFT's floor price in XLM instantly. 
                  No credit checks, no waiting periods.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h4>Secure & Transparent</h4>
                <p>
                  Built on Stellar smart contracts with on-chain oracle pricing. 
                  Your assets are always protected.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💎</div>
                <h4>Fair Pricing</h4>
                <p>
                  Oracle-based floor price discovery ensures you get fair 
                  market value for your NFT collateral.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🛡️</div>
                <h4>Liquidation Protection</h4>
                <p>
                  80% liquidation threshold gives you breathing room. 
                  Monitor your loan health in real-time.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h4>Built on Stellar</h4>
                <p>
                  Lightning-fast transactions with minimal fees. 
                  Experience DeFi the way it should be.
                </p>
              </div>
            </div>
          </section>

          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Loan-to-Value</h3>
                <p>70%</p>
              </div>
              <div className="stat-card">
                <h3>Liquidation Threshold</h3>
                <p>80%</p>
              </div>
              <div className="stat-card">
                <h3>Network</h3>
                <p>Stellar</p>
              </div>
              <div className="stat-card">
                <h3>Transaction Speed</h3>
                <p>~5s</p>
              </div>
            </div>
          </section>

          <footer className="footer">
            <p>Built with Scaffold Stellar | Testnet Deployment</p>
            <p>Network: Stellar Testnet | Powered by Soroban Smart Contracts</p>
          </footer>
        </>
      ) : (
        <div className="main-content">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Loan-to-Value Ratio</h3>
              <p>70%</p>
            </div>
            <div className="stat-card">
              <h3>Liquidation Threshold</h3>
              <p>80%</p>
            </div>
            <div className="stat-card">
              <h3>Network</h3>
              <p>Testnet</p>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <h2>
                <span className="card-icon">📋</span>
                Contract Addresses
              </h2>
              <div className="info-box">
                <p><strong>NFT Contract</strong></p>
                <code>{CONTRACTS.NFT_CONTRACT}</code>
              </div>
              <div className="info-box">
                <p><strong>Oracle Contract</strong></p>
                <code>{CONTRACTS.ORACLE_CONTRACT}</code>
              </div>
              <div className="info-box">
                <p><strong>Vault Contract</strong></p>
                <code>{CONTRACTS.VAULT_CONTRACT}</code>
              </div>
            </div>

            <MintNFT />
            <CheckPrice />
            <CalculateBorrow />
            <BorrowXLM />
            <RepayLoan />
            <LoanStatus />
            <LiquidationCheck />

            <div className="card">
              <h2>
                <span className="card-icon">📚</span>
                Documentation
              </h2>
              <p style={{ color: '#94a3b8', marginBottom: '20px', fontSize: '14px' }}>
                For detailed usage instructions, architecture details, and deployment guides, 
                check out the project documentation.
              </p>
              <a 
                href="https://github.com/faithful1ofall/StellarLend" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#a855f7', 
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                View on GitHub →
              </a>
            </div>
          </div>

          <footer className="footer">
            <p>Built with Scaffold Stellar | Testnet Deployment</p>
            <p>Network: Stellar Testnet | Powered by Soroban Smart Contracts</p>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
