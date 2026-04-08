import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/loanEngine';
import '../pages.css';

export default function TransactionHistory() {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                // Our backend has GET /api/transactions/user/{id}
                const data = await api.get(`/transactions/user/${currentUser.id}?size=50`);
                setTransactions(data.content || []);
            } catch (err) {
                console.error('Failed to fetch transactions:', err);
                setError('Could not load transaction history.');
            } finally {
                setLoading(false);
            }
        };

        if (currentUser?.id) {
            fetchTransactions();
        }
    }, [currentUser?.id]);

    const getTransactionIcon = (type) => {
        switch(type) {
            case 'DISBURSEMENT': return '💰';
            case 'PAYMENT': return '💸';
            case 'REFUND': return '🔄';
            case 'REPAYMENT': return '🤑';
            default: return '🔹';
        }
    };

    if (loading) return <div className="loading-container">Fetching your ledger...</div>;

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>Transaction Ledger</h1>
                <p>Complete audit trail of all financial movements on your account</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="glass-card card-section">
                <div className="card-section-header">
                    <h3>Audit History</h3>
                </div>
                
                <DataTable
                    columns={[
                        { 
                            key: 'type', 
                            label: 'Type', 
                            render: (v) => (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>{getTransactionIcon(v)}</span>
                                    <span style={{ fontWeight: 600 }}>{v.replace('_', ' ')}</span>
                                </div>
                            )
                        },
                        { key: 'loanId', label: 'Loan ID', render: v => `#${v}` },
                        { 
                            key: 'amount', 
                            label: 'Amount', 
                            render: v => (
                                <span className={v > 0 ? 'text-success' : 'text-danger'}>
                                    {formatCurrency(v)}
                                </span>
                            )
                        },
                        { 
                            key: 'timestamp', 
                            label: 'Date & Time', 
                            render: v => (
                                <div style={{ fontSize: 'var(--font-sm)' }}>
                                    <div style={{ fontWeight: 500 }}>{formatDate(v)}</div>
                                    <div style={{ color: 'var(--text-muted)' }}>{new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            ) 
                        },
                        { 
                            key: 'id', 
                            label: 'Ref Num', 
                            render: v => <span style={{ fontFamily: 'monospace', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>TX-{v}</span> 
                        }
                    ]}
                    data={transactions}
                    pageSize={10}
                />
            </div>

            <div className="info-box" style={{ marginTop: '24px' }}>
                💡 <strong>Security Note:</strong> This ledger is an immutable record of all financial activity. If you spot any discrepancies, please contact platform support immediately with the Reference Number.
            </div>
        </div>
    );
}
