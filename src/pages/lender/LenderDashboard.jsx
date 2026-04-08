import { useState, useEffect } from 'react';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import { AreaChartComponent } from '../../components/Charts';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { formatCurrency } from '../../utils/loanEngine';
import '../pages.css';

export default function LenderDashboard() {
    const { currentUser } = useAuth();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchLoans = async () => {
        try {
            setLoading(true);
            const data = await api.get('/loans/all?size=100');
            setLoans(data.content || []);
        } catch (err) {
            console.error('Failed to fetch lender portfolio:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const handleAction = async (loanId, action) => {
        try {
            setActionLoading(loanId + '-' + action);
            await api.put(`/loans/${loanId}/${action}`);
            await fetchLoans(); // Refresh data
        } catch (err) {
            alert(err.message || `Failed to ${action} loan`);
        } finally {
            setActionLoading(null);
        }
    };

    // Stats calculation
    const myPortfolio = loans.filter(l => l.lenderId === currentUser.id);
    const pendingLoans = loans.filter(l => l.status === 'PENDING');
    const totalLent = myPortfolio.reduce((s, l) => s + (l.amount || 0), 0);
    const totalEarnings = myPortfolio.reduce((s, l) => s + (l.totalRepaid - l.amount || 0), 0);
    const activeCount = myPortfolio.filter(l => l.status === 'ACTIVE').length;

    const monthlyData = [
        { month: 'Jan', earnings: 450 },
        { month: 'Feb', earnings: 520 },
        { month: 'Mar', earnings: 610 },
        { month: 'Apr', earnings: 580 },
        { month: 'May', earnings: 700 },
    ];

    if (loading) return <div className="loading-container">Loading portfolio...</div>;

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>Lender Command Center</h1>
                <p>Monitor your portfolio and process pending loan applications</p>
            </div>

            <div className="stats-grid">
                <StatsCard icon="💰" label="Total Lent" value={formatCurrency(totalLent)} trend="+12%" color="blue" delay={0} />
                <StatsCard icon="📈" label="Total Earnings" value={formatCurrency(totalEarnings)} trend="+8%" color="green" delay={50} />
                <StatsCard icon="📋" label="Active Loans" value={activeCount} color="purple" delay={100} />
                <StatsCard icon="⏳" label="Pending Apps" value={pendingLoans.length} color="yellow" delay={150} />
            </div>

            <div className="content-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Approval Queue</h3>
                    </div>
                    <div className="loan-table-wrapper">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Loan ID</th>
                                    <th>Borrower</th>
                                    <th>Amount</th>
                                    <th>Rate</th>
                                    <th>Duration</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingLoans.length === 0 ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>No pending applications.</td></tr>
                                ) : (
                                    pendingLoans.map(l => (
                                        <tr key={l.id}>
                                            <td>#{l.id}</td>
                                            <td>{l.borrowerName}</td>
                                            <td>{formatCurrency(l.amount)}</td>
                                            <td>{l.interestRate}%</td>
                                            <td>{l.durationMonths}m</td>
                                            <td className="action-cell">
                                                <button 
                                                    className="btn-sm btn-approve" 
                                                    disabled={actionLoading === l.id + '-approve'}
                                                    onClick={() => handleAction(l.id, 'approve')}
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    className="btn-sm btn-reject"
                                                    disabled={actionLoading === l.id + '-reject'}
                                                    onClick={() => handleAction(l.id, 'reject')}
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>My Portfolio Details</h3>
                    </div>
                    <div className="loan-table-wrapper">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Loan ID</th>
                                    <th>Borrower</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Repaid</th>
                                    <th>Remaining</th>
                                    <th>Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myPortfolio.map(l => (
                                    <tr key={l.id}>
                                        <td>#{l.id}</td>
                                        <td>{l.borrowerName}</td>
                                        <td>{formatCurrency(l.amount)}</td>
                                        <td><StatusBadge status={l.status.toLowerCase()} /></td>
                                        <td>{formatCurrency(l.totalRepaid)}</td>
                                        <td>{formatCurrency(l.remainingBalance)}</td>
                                        <td>
                                            {l.status === 'APPROVED' && (
                                                <button 
                                                    className="btn-sm btn-primary"
                                                    disabled={actionLoading === l.id + '-disburse'}
                                                    onClick={() => handleAction(l.id, 'disburse')}
                                                >
                                                    Disburse
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
