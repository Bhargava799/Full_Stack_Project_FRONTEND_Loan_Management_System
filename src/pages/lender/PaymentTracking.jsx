import StatsCard from '../../components/StatsCard';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { loans, transactions as allTransactions } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/loanEngine';
import '../pages.css';

export default function PaymentTracking() {
    const myLoans = loans.filter(l => l.lenderId === 'u2');
    const myLoanIds = myLoans.map(l => l.id);
    const myTransactions = allTransactions.filter(t => myLoanIds.includes(t.loanId));

    const payments = myTransactions.filter(t => t.type === 'Payment');
    const totalReceived = payments.reduce((s, t) => s + t.amount, 0);
    const overdueLoans = myLoans.filter(l => l.status === 'overdue');

    // Upcoming payments (simulated)
    const upcoming = myLoans
        .filter(l => l.nextPaymentDate && (l.status === 'active' || l.status === 'overdue'))
        .map(l => {
            const d = new Date(l.nextPaymentDate);
            return {
                id: `UP-${l.id}`,
                loanId: l.id,
                borrowerName: l.borrowerName,
                amount: l.emi,
                dueDate: l.nextPaymentDate,
                day: d.getDate(),
                month: d.toLocaleString('default', { month: 'short' }),
                purpose: l.purpose,
                status: l.status === 'overdue' ? 'overdue' : 'upcoming',
            };
        });

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>Payment Tracking</h1>
                <p>Monitor incoming payments and track overdue alerts</p>
            </div>

            <div className="stats-grid">
                <StatsCard icon="💵" label="Total Received" value={formatCurrency(totalReceived)} trend="9%" color="green" delay={0} />
                <StatsCard icon="📋" label="Total Payments" value={payments.length} color="blue" delay={50} />
                <StatsCard icon="⚠️" label="Overdue Loans" value={overdueLoans.length} color="red" delay={100} />
                <StatsCard icon="📅" label="Upcoming Payments" value={upcoming.length} color="yellow" delay={150} />
            </div>

            <div className="content-grid">
                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Upcoming Payments</h3>
                    </div>
                    {upcoming.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <p>No upcoming payments</p>
                        </div>
                    ) : (
                        upcoming.map(p => (
                            <div className="payment-item" key={p.id}>
                                <div className="payment-date">
                                    <span className="day">{p.day}</span>
                                    <span className="month">{p.month}</span>
                                </div>
                                <div className="payment-details">
                                    <div className="payment-desc">{p.borrowerName}</div>
                                    <div className="payment-loan">{p.loanId} · {p.purpose}</div>
                                </div>
                                <StatusBadge status={p.status} />
                                <span className="payment-amount">{formatCurrency(p.amount)}</span>
                            </div>
                        ))
                    )}
                </div>

                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Payment History</h3>
                    </div>
                    <DataTable
                        columns={[
                            { key: 'id', label: 'Tx ID' },
                            { key: 'type', label: 'Type' },
                            { key: 'amount', label: 'Amount', render: v => formatCurrency(v) },
                            { key: 'date', label: 'Date', render: v => formatDate(v) },
                            { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
                        ]}
                        data={myTransactions}
                        pageSize={8}
                    />
                </div>
            </div>
        </div>
    );
}
