import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Background Glowing Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <header className="landing-navbar">
        <div className="brand-wrap">
          <div className="brand-logo-glow">
            <span className="brand-mark" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <div className="brand-copy">
            <h1>LoanPro</h1>
            <p>Enterprise Finance</p>
          </div>
        </div>

        <div className="nav-links">
           <a href="#features" className="nav-item">Features</a>
           <a href="#roles" className="nav-item">Roles</a>
           <Link to="/login" className="nav-login-link">
             Secure Login <span className="arrow">→</span>
           </Link>
        </div>
      </header>

      <main>
        {/* Dynamic Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="live-dot"></span> Next-Gen Lending Engine 2.0
            </div>
            
            <h2 className="hero-title">
              Power Your Financial Operations with <span className="text-gradient">Total Clarity.</span>
            </h2>
            
            <p className="hero-description">
              Unify Borrowers, Lenders, and Analysts on a blazing-fast, secure platform. 
              Accelerate approvals, monitor risks in real-time, and automate repayment schedules with precision.
            </p>
            
            <div className="hero-actions">
              <Link to="/login" className="cta-primary pulse-btn">
                Launch Dashboard
              </Link>
              <a href="#features" className="cta-secondary">
                View Capabilities
              </a>
            </div>
            
            {/* Trust Badges */}
            <div className="trust-metrics">
                <div className="metric">
                  <strong>+400%</strong>
                  <span>Approval Speed</span>
                </div>
                <div className="metric">
                  <strong>$0</strong>
                  <span>Unaccounted Risk</span>
                </div>
                <div className="metric">
                  <strong>100%</strong>
                  <span>Audit Compliant</span>
                </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
             <div className="mockup-container">
                 {/* Main Dashboard Panel */}
                 <div className="mockup-panel main-panel">
                     <div className="mockup-header">
                        <div className="mockup-dots"><span/><span/><span/></div>
                        <div className="mockup-search"></div>
                     </div>
                     <div className="mockup-body">
                         <div className="mockup-stats">
                             <div className="m-stat primary-stat">
                                <div className="stat-icon">💳</div>
                                <div className="stat-lines"><div className="s-line full"></div><div className="s-line half"></div></div>
                             </div>
                             <div className="m-stat">
                                <div className="stat-icon success">📈</div>
                                <div className="stat-lines"><div className="s-line sm"></div></div>
                             </div>
                         </div>
                         <div className="mockup-chart-box">
                             <div className="chart-bar" style={{height: '40%'}}></div>
                             <div className="chart-bar" style={{height: '70%'}}></div>
                             <div className="chart-bar active" style={{height: '100%'}}></div>
                             <div className="chart-bar" style={{height: '50%'}}></div>
                             <div className="chart-bar" style={{height: '80%'}}></div>
                         </div>
                     </div>
                 </div>
                 
                 {/* Floating Side Card */}
                 <div className="mockup-panel floating-card">
                     <div className="floating-card-header">
                        <span className="fc-icon">🛡️</span> Risk Assessed
                     </div>
                     <div className="fc-score">
                        <div className="score-ring">94</div>
                     </div>
                     <div className="fc-text">Low Risk Profile</div>
                 </div>
             </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="features-grid">
           <div className="section-title">
               <h2>Built for Institutional Scale</h2>
               <p>Everything you need to securely disburse and manage capital.</p>
           </div>
           
           <div className="grid-container">
               <article className="feature-card">
                 <div className="f-icon-box blue">🏦</div>
                 <h3>Smart Origination</h3>
                 <p>Automate background checks, enforce minimum limits, and generate flawless amortizations instantly upon approval.</p>
               </article>
               
               <article className="feature-card">
                 <div className="f-icon-box purple">📊</div>
                 <h3>Predictive Risk Analytics</h3>
                 <p>Arm analysts with live portfolio graphs, default rate monitoring, and automated active delinquency reporting.</p>
               </article>
               
               <article className="feature-card">
                 <div className="f-icon-box green">🔐</div>
                 <h3>Bank-Grade Security</h3>
                 <p>Fortified with JWT Bearer strategies, rigorous role-based routing (RBAC), and immutable transaction ledgers.</p>
               </article>
           </div>
        </section>

        {/* Roles Section */}
        <section id="roles" className="roles-section">
            <div className="roles-container">
               <div className="role-text-content">
                  <h2>One Unified Operating System</h2>
                  <p>Say goodbye to fragmented spreadsheets. Each role commands their own tailored, secure workspace engineered for maximum productivity.</p>
                  
                  <ul className="role-list">
                     <li>
                        <span className="check-icon">✓</span> <strong>Lenders:</strong> Disburse capital, command oversight, and track active payments beautifully.
                     </li>
                     <li>
                        <span className="check-icon">✓</span> <strong>Borrowers:</strong> Request funds, review clear repayment structures, and submit custom EMI payments.
                     </li>
                     <li>
                        <span className="check-icon">✓</span> <strong>Analysts:</strong> Monitor macro-level health, assess overall exposure, and generate audit-ready metrics.
                     </li>
                  </ul>
               </div>
               
               <div className="role-visual-stack">
                   <div className="stack-card card-1">
                      <div className="card-top">Borrower View</div>
                      <div className="mock-lines"><div/><div/><div/></div>
                   </div>
                   <div className="stack-card card-2">
                      <div className="card-top">Lender View</div>
                      <div className="mock-lines"><div/><div/></div>
                   </div>
                   <div className="stack-card card-3">
                      <div className="card-top analyst-tag">Analyst Terminal</div>
                      <div className="mock-graph"><div className="g-line"/><div className="g-line"/><div className="g-line"/></div>
                   </div>
               </div>
            </div>
        </section>
      </main>
      
      <footer className="landing-footer">
         <div className="footer-content">
            <div className="brand-wrap">
              <span className="brand-mark small" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>LoanPro Systems</span>
            </div>
            <p className="copyright">&copy; 2026 LoanPro Architecture. All rights reserved.</p>
         </div>
      </footer>
    </div>
  );
}
