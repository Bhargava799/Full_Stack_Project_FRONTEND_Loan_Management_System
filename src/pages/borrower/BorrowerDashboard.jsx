import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import { AreaChartComponent } from '../../components/Charts';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import '../pages.css';

export default function BorrowerDashboard() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const data = await api.get(`/loans/user/${currentUser.id}?size=100`);
                setLoans(data.content || []);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError('Could not load loan data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (currentUser?.id) {
            fetchDashboardData();
        }
    }, [currentUser?.id]);

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val || 0);

    const activeLoans = loans.filter(l => l.status === 'ACTIVE');
    const totalBorrowed = loans.filter(l => l.status !== 'REJECTED' && l.status !== 'PENDING')
        .reduce((s, l) => s + (l.amount || 0), 0);
    const totalRepaid = loans.reduce((s, l) => s + (l.totalRepaid || 0), 0);
    const outstanding = loans.reduce((s, l) => s + (l.remainingBalance || 0), 0);

    // Simulated payment history from chart (keeping it visual but based on current data)
    const paymentData = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return {
            month: d.toLocaleString('default', { month: 'short' }),
            paid: totalRepaid / 6 // Simulated distribution for visual appeal
        };
    });

    if (loading) return <div className="loading-container">Loading your dashboard...</div>;
    if (error) return <div className="error-container">{error}</div>;

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>My Loans Overview</h1>
                <p>Track your loans, payments, and outstanding balances</p>
            </div>

            <div className="stats-grid">
                <StatsCard icon="💰" label="Total Borrowed" value={formatCurrency(totalBorrowed)} color="blue" delay={0} />
                <StatsCard icon="✅" label="Total Repaid" value={formatCurrency(totalRepaid)} trend="On track" color="green" delay={50} />
                <StatsCard icon="📊" label="Outstanding" value={formatCurrency(outstanding)} color="yellow" delay={100} />
                <StatsCard icon="🏆" label="Active Loans" value={activeLoans.length} color="purple" delay={150} />
            </div>

            <div className="content-grid">
                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Repayment Progress</h3>
                    </div>
                    <AreaChartComponent data={paymentData} dataKey="paid" xKey="month" color="#06d6a0" height={280} />
                </div>

                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>My Active Loans</h3>
                    </div>
                    <div className="loan-summary-list">
                        {loans.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No loans found. Apply for your first loan!</p>
                        ) : (
                            loans.map(l => {
                                const totalExpected = (l.amount || 0) + ((l.amount || 0) * (l.interestRate || 0) * (l.durationMonths || 0) / 1200);
                                const progress = totalExpected > 0 ? (((l.totalRepaid || 0) / totalExpected) * 100).toFixed(0) : 0;
                                
                                return (
                                    <div key={l.id} className="loan-list-item">
                                        <div className="loan-item-header">
                                            <div>
                                                <span className="loan-id">#{l.id}</span>
                                                <span className="loan-meta">{formatCurrency(l.amount)} @ {l.interestRate}%</span>
                                            </div>
                                            <StatusBadge status={l.status.toLowerCase()} />
                                        </div>
                                        <div className="progress-bar-container">
                                            <div className="progress-bar-label">
                                                <span>Repayment Progress</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="progress-bar-track">
                                                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                                            </div>
                                        </div>
                                        {l.status === 'ACTIVE' && (
                                            <button 
                                                className="btn btn-sm btn-primary" 
                                                style={{ marginTop: '12px', width: '100%' }}
                                                onClick={() => navigate('/borrower/schedule')}
                                            >
                                                Repay Now
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
