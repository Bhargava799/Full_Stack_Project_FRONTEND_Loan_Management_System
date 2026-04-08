import DataTable from '../../components/DataTable';
import { BarChartComponent } from '../../components/Charts';
import { riskData } from '../../data/mockData';
import { getRiskCategory, formatCurrency } from '../../utils/loanEngine';
import '../pages.css';

export default function RiskAssessment() {
    const riskChartData = riskData.map(r => ({
        name: r.name.split(' ')[0],
        riskScore: r.riskScore,
        creditScore: Math.round(r.creditScore / 10),
    }));

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>Risk Assessment</h1>
                <p>Evaluate borrower risk profiles and creditworthiness</p>
            </div>

            <div className="content-grid">
                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Risk Scores by Borrower</h3>
                    </div>
                    <BarChartComponent
                        data={riskChartData}
                        dataKey="riskScore"
                        xKey="name"
                        color="#06d6a0"
                        height={300}
                    />
                </div>

                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Risk Matrix</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                        {riskData.map(b => {
                            const risk = getRiskCategory(b.riskScore);
                            return (
                                <div key={b.name} style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 600 }}>{b.name}</span>
                                        <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: risk.color, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: `${risk.color}20` }}>
                                            {risk.label}
                                        </span>
                                    </div>
                                    <div className="risk-meter">
                                        <div className="risk-meter-bar">
                                            <div className="risk-meter-fill" style={{ width: `${b.riskScore}%`, background: risk.color }} />
                                        </div>
                                        <span className="risk-meter-value" style={{ color: risk.color }}>{b.riskScore}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="glass-card card-section">
                <div className="card-section-header">
                    <h3>Borrower Risk Profiles</h3>
                </div>
                <DataTable
                    columns={[
                        { key: 'name', label: 'Borrower' },
                        { key: 'creditScore', label: 'Credit Score' },
                        { key: 'dti', label: 'DTI Ratio', render: v => `${(v * 100).toFixed(0)}%` },
                        { key: 'income', label: 'Income', render: v => formatCurrency(v) },
                        { key: 'missedPayments', label: 'Missed Payments' },
                        {
                            key: 'riskScore', label: 'Risk Score', render: (v) => {
                                const risk = getRiskCategory(v);
                                return <span style={{ fontWeight: 700, color: risk.color }}>{v}</span>;
                            }
                        },
                        {
                            key: 'riskScore', label: 'Category', render: v => {
                                const risk = getRiskCategory(v);
                                return <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: risk.color, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: `${risk.color}20` }}>{risk.label}</span>;
                            }
                        },
                    ]}
                    data={riskData}
                    pageSize={10}
                />
            </div>
        </div>
    );
}
