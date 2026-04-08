import { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/loanEngine';
import '../pages.css';

export default function PaymentSchedule() {
    const { currentUser } = useAuth();
    const [loans, setLoans] = useState([]);
    const [selectedLoanId, setSelectedLoanId] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [payLoading, setPayLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [customAmount, setCustomAmount] = useState(0);

    const [showModal, setShowModal] = useState(false);

    const fetchLoans = async () => {
        try {
            const data = await api.get(`/loans/user/${currentUser.id}`);
            const activeOnes = (data.content || []).filter(l => l.status === 'ACTIVE' || l.status === 'CLOSED' || l.status === 'APPROVED');
            setLoans(activeOnes);
            if (activeOnes.length > 0 && !selectedLoanId) {
                setSelectedLoanId(activeOnes[0].id);
            }
        } catch (err) {
            console.error('Fetch loans error:', err);
        }
    };

    const fetchSchedule = async (id) => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await api.get(`/repayments/loan/${id}`);
            setSchedule(data);
        } catch (err) {
            console.error('Fetch schedule error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    useEffect(() => {
        fetchSchedule(selectedLoanId);
        // Pre-fill the custom payment amount with the standard EMI
        const current = loans.find(l => l.id === selectedLoanId);
        if (current && current.durationMonths > 0) {
            const emi = current.amount / current.durationMonths;
            setCustomAmount(emi.toFixed(2));
        }
    }, [selectedLoanId, loans]);

    const currentLoan = loans.find(l => l.id === selectedLoanId);
    
    const accurateRemainingBalance = schedule
        .filter(inst => inst.status !== 'PAID')
        .reduce((sum, inst) => sum + (inst.amount || 0), 0);

    const accurateTotalRepaid = schedule
        .filter(inst => inst.status === 'PAID')
        .reduce((sum, inst) => sum + (inst.amount || 0), 0);

    const handlePayment = async () => {
        if (!selectedLoanId) return;
        try {
            setPayLoading(true);
            
            const amountToPay = parseFloat(customAmount);
            if (amountToPay <= 0 || isNaN(amountToPay)) {
                setMessage('Error: Custom amount must be greater than 0.');
                setPayLoading(false);
                return;
            }
            if (amountToPay > accurateRemainingBalance) {
                setMessage(`Error: You cannot pay more than the remaining balance (${formatCurrency(accurateRemainingBalance)}).`);
                setPayLoading(false);
                return;
            }
            
            await api.post(`/payments/pay?loanId=${selectedLoanId}`, { amount: amountToPay });
            setShowModal(true);
            fetchSchedule(selectedLoanId);
            fetchLoans();
        } catch (err) {
            setMessage('Error: ' + err.message);
        } finally {
            setPayLoading(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>Payment Schedule</h1>
                <p>View your amortization schedule and make payments</p>
            </div>

            <div className="loan-selector-strip">
                {loans.map(l => (
                    <button
                        key={l.id}
                        className={`btn-pill ${selectedLoanId === l.id ? 'active' : ''}`}
                        onClick={() => setSelectedLoanId(l.id)}
                    >
                        #{l.id} — {l.purpose}
                    </button>
                ))}
            </div>

            {currentLoan && (
                <div className="schedule-container">
                    <div className="glass-card summary-bar">
                        <div className="summary-item">
                            <span className="label">Remaining Balance</span>
                            <span className="value primary">{formatCurrency(accurateRemainingBalance)}</span>
                        </div>
                        <div className="summary-item">
                            <span className="label">Total Repaid</span>
                            <span className="value success">{formatCurrency(accurateTotalRepaid)}</span>
                        </div>
                        <div className="summary-item">
                            {currentLoan.status === 'ACTIVE' ? (
                                <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                                    <input 
                                       type="number" 
                                       min="1" 
                                       max={accurateRemainingBalance}
                                       step="0.01"
                                       value={customAmount}
                                       onChange={(e) => setCustomAmount(e.target.value)}
                                       className="form-control"
                                       style={{ width: '120px', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                                    />
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={handlePayment}
                                        disabled={payLoading || customAmount <= 0 || customAmount > accurateRemainingBalance}
                                    >
                                        {payLoading ? 'Processing...' : 'Pay Amount'}
                                    </button>
                                </div>
                            ) : currentLoan.status === 'APPROVED' ? (
                                <div className="status-info-box">
                                    <span className="info-icon">ℹ️</span>
                                    <span>Waiting for Disbursement by Lender</span>
                                </div>
                            ) : currentLoan.status === 'CLOSED' ? (
                                <span className="status-completed">Loan Fully Repaid</span>
                            ) : (
                                <span className="status-pending">Repayment not available for {currentLoan.status} loans</span>
                            )}
                        </div>
                    </div>

                    {message && <div className={`status-toast ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

                    <div className="glass-card card-section">
                        <div className="card-section-header">
                            <h3>Amortization Schedule</h3>
                        </div>
                        <div className="loan-table-wrapper">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Inst. #</th>
                                        <th>Due Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading schedule...</td></tr>
                                    ) : schedule.length === 0 ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center' }}>No schedule generated yet.</td></tr>
                                    ) : (
                                        schedule.map((inst, idx) => (
                                            <tr key={inst.id} className={inst.status === 'PAID' ? 'row-paid' : ''}>
                                                <td>{idx + 1}</td>
                                                <td>{formatDate(inst.dueDate)}</td>
                                                <td>{formatCurrency(inst.amount)}</td>
                                                <td><StatusBadge status={inst.status.toLowerCase()} /></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' }}>
                    <div className="glass-card animate-fadeIn" style={{ padding: '40px', textAlign: 'center', maxWidth: '420px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📱</div>
                        <h2 style={{ marginBottom: '12px', color: 'var(--text-primary)', fontWeight: '600' }}>Demo Payment Done!</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '15px', lineHeight: '1.5' }}>
                            Your customized payment of <strong style={{color: 'var(--text-primary)'}}>{formatCurrency(customAmount)}</strong> was successfully simulated and recorded on your secured transaction ledger.
                        </p>
                        <button 
                            className="btn btn-primary" 
                            style={{ width: '100%', padding: '12px', fontSize: '16px' }}
                            onClick={() => setShowModal(false)}
                        >
                            Return to Schedule
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
