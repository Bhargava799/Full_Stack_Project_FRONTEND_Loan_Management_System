import { useState } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { loans, loanApplications } from '../../data/mockData';
import { formatCurrency } from '../../utils/loanEngine';
import '../pages.css';

export default function LoanOversight() {
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [tab, setTab] = useState('loans');

    const loanColumns = [
        { key: 'id', label: 'Loan ID' },
        { key: 'borrowerName', label: 'Borrower' },
        { key: 'lenderName', label: 'Lender' },
        { key: 'type', label: 'Type' },
        { key: 'principal', label: 'Principal', render: v => formatCurrency(v) },
        { key: 'annualRate', label: 'Rate', render: v => `${v}%` },
        { key: 'tenureMonths', label: 'Tenure', render: v => `${v} mo` },
        { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
        {
            key: 'id',
            label: '',
            sortable: false,
            render: (_, row) => (
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedLoan(row)}>Details</button>
            ),
        },
    ];

    const appColumns = [
        { key: 'id', label: 'App ID' },
        { key: 'borrowerName', label: 'Applicant' },
        { key: 'type', label: 'Type' },
        { key: 'amount', label: 'Amount', render: v => formatCurrency(v) },
        { key: 'rate', label: 'Rate', render: v => `${v}%` },
        { key: 'creditScore', label: 'Credit Score' },
        { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
        {
            key: 'id',
            label: 'Actions',
            sortable: false,
            render: (_, row) => row.status === 'pending' ? (
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-primary btn-sm">Approve</button>
                    <button className="btn btn-danger btn-sm">Reject</button>
                </div>
            ) : '—',
        },
    ];

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>Loan Oversight</h1>
                <p>Review and manage all loans and applications</p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <button
                    className={`btn ${tab === 'loans' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    onClick={() => setTab('loans')}
                >
                    All Loans ({loans.length})
                </button>
                <button
                    className={`btn ${tab === 'applications' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    onClick={() => setTab('applications')}
                >
                    Applications ({loanApplications.length})
                </button>
            </div>

            <div className="glass-card card-section">
                {tab === 'loans' ? (
                    <DataTable columns={loanColumns} data={loans} pageSize={8} filterable filterKey="borrowerName" />
                ) : (
                    <DataTable columns={appColumns} data={loanApplications} pageSize={8} />
                )}
            </div>

            <Modal
                isOpen={!!selectedLoan}
                onClose={() => setSelectedLoan(null)}
                title={`Loan ${selectedLoan?.id}`}
            >
                {selectedLoan && (
                    <div className="detail-grid">
                        <div className="detail-item">
                            <div className="detail-label">Borrower</div>
                            <div className="detail-value">{selectedLoan.borrowerName}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Lender</div>
                            <div className="detail-value">{selectedLoan.lenderName}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Principal</div>
                            <div className="detail-value">{formatCurrency(selectedLoan.principal)}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Interest Rate</div>
                            <div className="detail-value">{selectedLoan.annualRate}%</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Monthly EMI</div>
                            <div className="detail-value">{formatCurrency(selectedLoan.emi)}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Tenure</div>
                            <div className="detail-value">{selectedLoan.tenureMonths} months</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Status</div>
                            <div className="detail-value"><StatusBadge status={selectedLoan.status} /></div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Purpose</div>
                            <div className="detail-value">{selectedLoan.purpose}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Disbursed</div>
                            <div className="detail-value">{selectedLoan.disbursedDate || '—'}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Total Paid</div>
                            <div className="detail-value">{formatCurrency(selectedLoan.totalPaid)}</div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
