import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import '../pages.css';

export default function LoanApplication() {
    const [form, setForm] = useState({
        amount: 5000,
        durationMonths: 12,
        interestRate: 10.5,
        purpose: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const update = (key, val) => setForm(p => ({ ...p, [key]: val }));

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val || 0);

    const emi = useMemo(() => {
        const p = form.amount;
        const r = form.interestRate / 1200;
        const n = form.durationMonths;
        if (r === 0) return p / n;
        return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }, [form.amount, form.interestRate, form.durationMonths]);

    const totalRepayable = emi * form.durationMonths;
    const totalInterest = totalRepayable - form.amount;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            await api.post('/loans/apply', form);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="success-container animate-fadeIn">
                <div className="glass-card success-card">
                    <div className="success-icon">✅</div>
                    <h2>Application Submitted!</h2>
                    <p>Your loan application is now pending approval. Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>Apply for a Loan</h1>
                <p>Enter your loan requirements and check the estimated EMIs</p>
            </div>

            <div className="content-grid">
                <div className="glass-card card-section">
                    <h3 style={{ marginBottom: '24px' }}>Loan Configuration</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Loan Amount: {formatCurrency(form.amount)}</label>
                            <input
                                type="range"
                                min="500"
                                max="1000000"
                                step="500"
                                value={form.amount}
                                onChange={e => update('amount', Number(e.target.value))}
                                style={{ accentColor: 'var(--accent-primary)' }}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Duration: {form.durationMonths} months</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="60"
                                    step="1"
                                    value={form.durationMonths}
                                    onChange={e => update('durationMonths', Number(e.target.value))}
                                    style={{ accentColor: 'var(--accent-primary)' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Interest Rate (%): {form.interestRate}%</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    max="50"
                                    value={form.interestRate}
                                    onChange={e => update('interestRate', Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Purpose of Loan</label>
                            <input
                                type="text"
                                placeholder="e.g. Debt Consolidation, Home Improvement"
                                required
                                value={form.purpose}
                                onChange={e => update('purpose', e.target.value)}
                            />
                        </div>

                        {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="glass-card card-section">
                    <h3 style={{ marginBottom: '16px' }}>Loan Estimate</h3>
                    <div className="preview-box">
                        <div className="preview-row">
                            <span className="preview-label">Monthly EMI</span>
                            <span className="preview-value" style={{ color: 'var(--accent-primary)', fontSize: '1.4rem' }}>
                                {formatCurrency(emi)}
                            </span>
                        </div>
                        <div className="preview-row">
                            <span className="preview-label">Total Principal</span>
                            <span className="preview-value">{formatCurrency(form.amount)}</span>
                        </div>
                        <div className="preview-row">
                            <span className="preview-label">Total Interest</span>
                            <span className="preview-value">{formatCurrency(totalInterest)}</span>
                        </div>
                        <div className="preview-row" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', marginTop: '12px' }}>
                            <span className="preview-label" style={{ fontWeight: 700 }}>Total Repayment</span>
                            <span className="preview-value" style={{ fontWeight: 700 }}>{formatCurrency(totalRepayable)}</span>
                        </div>
                    </div>
                    <div className="info-box" style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        ℹ️ This is an estimated calculation. Final rates are subject to lender approval.
                    </div>
                </div>
            </div>
        </div>
    );
}
