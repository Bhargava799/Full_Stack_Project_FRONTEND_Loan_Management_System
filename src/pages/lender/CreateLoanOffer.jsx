import { useState, useMemo } from 'react';
import { calculateEMI, calculateTotalInterest, generateAmortizationSchedule, formatCurrency, formatCurrencyExact } from '../../utils/loanEngine';
import DataTable from '../../components/DataTable';
import '../pages.css';

export default function CreateLoanOffer() {
    const [form, setForm] = useState({
        amount: 25000,
        rate: 8.5,
        tenure: 36,
        type: 'Personal',
        purpose: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const emi = useMemo(() => calculateEMI(form.amount, form.rate, form.tenure), [form.amount, form.rate, form.tenure]);
    const totalInterest = useMemo(() => calculateTotalInterest(form.amount, form.rate, form.tenure), [form.amount, form.rate, form.tenure]);
    const totalPayment = form.amount + totalInterest;
    const schedule = useMemo(() => generateAmortizationSchedule(form.amount, form.rate, form.tenure).slice(0, 6), [form.amount, form.rate, form.tenure]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>Create Loan Offer</h1>
                <p>Configure loan terms and preview EMI calculations</p>
            </div>

            <div className="content-grid">
                <div className="glass-card card-section">
                    <h3 style={{ marginBottom: '24px' }}>Loan Terms</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Loan Type</label>
                                <select value={form.type} onChange={e => update('type', e.target.value)}>
                                    <option>Personal</option>
                                    <option>Auto</option>
                                    <option>Mortgage</option>
                                    <option>Education</option>
                                    <option>Business</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Purpose</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Home Renovation"
                                    value={form.purpose}
                                    onChange={e => update('purpose', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Loan Amount: {formatCurrency(form.amount)}</label>
                            <input
                                type="range"
                                min="1000"
                                max="500000"
                                step="1000"
                                value={form.amount}
                                onChange={e => update('amount', Number(e.target.value))}
                                style={{ accentColor: 'var(--accent-primary)' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                                <span>$1,000</span><span>$500,000</span>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Annual Interest Rate: {form.rate}%</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="25"
                                    step="0.25"
                                    value={form.rate}
                                    onChange={e => update('rate', Number(e.target.value))}
                                    style={{ accentColor: 'var(--accent-primary)' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                                    <span>1%</span><span>25%</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Tenure: {form.tenure} months ({(form.tenure / 12).toFixed(1)} years)</label>
                                <input
                                    type="range"
                                    min="6"
                                    max="360"
                                    step="6"
                                    value={form.tenure}
                                    onChange={e => update('tenure', Number(e.target.value))}
                                    style={{ accentColor: 'var(--accent-primary)' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                                    <span>6 mo</span><span>30 yr</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={submitted}>
                                {submitted ? '✓ Offer Created!' : 'Create Loan Offer'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => setForm({ amount: 25000, rate: 8.5, tenure: 36, type: 'Personal', purpose: '' })}>
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                <div>
                    <div className="glass-card card-section" style={{ marginBottom: '24px' }}>
                        <h3 style={{ marginBottom: '16px', color: 'var(--accent-primary)' }}>EMI Preview</h3>
                        <div className="preview-box" style={{ marginTop: 0 }}>
                            <div className="preview-row">
                                <span className="preview-label">Monthly EMI</span>
                                <span className="preview-value" style={{ fontSize: 'var(--font-xl)', color: 'var(--accent-primary)' }}>{formatCurrencyExact(emi)}</span>
                            </div>
                            <div className="preview-row">
                                <span className="preview-label">Total Interest</span>
                                <span className="preview-value">{formatCurrency(totalInterest)}</span>
                            </div>
                            <div className="preview-row">
                                <span className="preview-label">Total Payment</span>
                                <span className="preview-value">{formatCurrency(totalPayment)}</span>
                            </div>
                            <div className="preview-row">
                                <span className="preview-label">Interest-to-Principal</span>
                                <span className="preview-value">{((totalInterest / form.amount) * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card card-section">
                        <h3 style={{ marginBottom: '16px' }}>Amortization Preview (First 6 Months)</h3>
                        <DataTable
                            columns={[
                                { key: 'month', label: '#' },
                                { key: 'emi', label: 'EMI', render: v => formatCurrencyExact(v) },
                                { key: 'principal', label: 'Principal', render: v => formatCurrencyExact(v) },
                                { key: 'interest', label: 'Interest', render: v => formatCurrencyExact(v) },
                                { key: 'balance', label: 'Balance', render: v => formatCurrency(v) },
                            ]}
                            data={schedule}
                            pageSize={6}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
