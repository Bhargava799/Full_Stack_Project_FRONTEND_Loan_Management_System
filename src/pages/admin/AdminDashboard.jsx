import { useState, useEffect } from 'react';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import { AreaChartComponent } from '../../components/Charts';
import { api } from '../../utils/api';
import { formatCurrency } from '../../utils/loanEngine';
import '../pages.css';

export default function AdminDashboard() {
    const [summary, setSummary] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setLoading(true);
                const [summaryData, txData] = await Promise.all([
                    api.get('/analytics/summary'),
                    api.get('/transactions/all?size=10')
                ]);
                setSummary(summaryData);
                setRecentTransactions(txData.content || []);
            } catch (err) {
                console.error('Failed to fetch admin dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    if (loading) return <div className="loading-container">Loading platform overview...</div>;
    if (!summary) return <div className="error-container">Could not load admin stats.</div>;

    const historicalData = [
        { month: 'Jan', revenue: 1200, loans: 45 },
        { month: 'Feb', revenue: 1540, loans: 52 },
        { month: 'Mar', revenue: 1890, loans: 61 },
        { month: 'Apr', revenue: 1720, loans: 58 },
        { month: 'May', revenue: 2150, loans: 70 },
    ];

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>Platform Command Center</h1>
                <p>Global oversight of loans, users, and financial health</p>
            </div>

            <div className="stats-grid">
                <StatsCard icon="📋" label="Total Loans" value={summary.totalLoans} trend="+12%" color="blue" delay={0} />
                <StatsCard icon="✅" label="Active Loans" value={summary.activeLoans} trend="82%" color="green" delay={50} />
                <StatsCard icon="💰" label="Total Revenue" value={formatCurrency(summary.totalRevenue)} trend="+15%" color="purple" delay={100} />
                <StatsCard icon="⚠️" label="Default Rate" value={`${summary.defaultRate.toFixed(2)}%`} trendDir="down" color="red" delay={150} />
            </div>

            <div className="content-grid">
                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Investment Performance</h3>
                    </div>
                    <AreaChartComponent
                        data={historicalData}
                        dataKey="revenue"
                        color="#6366f1"
                        height={280}
                    />
                </div>

                <div className="glass-card activity-feed">
                    <div className="card-section-header">
                        <h3>System Audit Trail</h3>
                    </div>
                    <div className="tx-list">
                        {recentTransactions.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No recent activity.</p>
                        ) : (
                            recentTransactions.map(tx => (
                                <div className="tx-item" key={tx.id}>
                                    <div className="tx-icon">🔹</div>
                                    <div className="tx-info">
                                        <div className="tx-text">{tx.type.replace('_', ' ')}: {formatCurrency(tx.amount)}</div>
                                        <div className="tx-time">User ID: {tx.userId} • {new Date(tx.timestamp).toLocaleString()}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="glass-card card-section" style={{ marginTop: '24px' }}>
                <div className="card-section-header">
                    <h3>Financial Integrity Audit</h3>
                </div>
                <div style={{ padding: '16px' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                        The Ledger Consistency Audit verifies that for any given loan: 
                        <strong> Total Scheduled == Total Paid + Remaining Balance</strong>.
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <input 
                            type="number" 
                            id="auditId"
                            placeholder="Enter Loan ID (e.g. 1)" 
                            style={{ flex: 1, padding: '12px', background: 'var(--bg-glass)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', color: 'white' }}
                        />
                        <button 
                            className="btn btn-primary"
                            onClick={async () => {
                                const id = document.getElementById('auditId').value;
                                if (!id) return alert('Please enter a Loan ID');
                                try {
                                    await api.get(`/analytics/audit/${id}`);
                                    alert('✅ LEDGER CONSISTENT: Loan #' + id + ' is financially secure.');
                                } catch (e) {
                                    alert('❌ INTEGRITY FAILURE: ' + (e.message || 'Ledger mismatch detected.'));
                                }
                            }}
                        >
                            Execute Run
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
