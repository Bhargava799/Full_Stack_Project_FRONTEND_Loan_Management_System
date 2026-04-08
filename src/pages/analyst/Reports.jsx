import { LineChartComponent, AreaChartComponent } from '../../components/Charts';
import { monthlyData } from '../../data/mockData';
import '../pages.css';

export default function Reports() {
    const reportCards = [
        { icon: '📊', title: 'Portfolio Summary', desc: 'Complete overview of all loans, disbursements, and repayments.' },
        { icon: '📈', title: 'Trend Analysis', desc: 'Monthly and quarterly trends in loan performance metrics.' },
        { icon: '⚠️', title: 'Risk Report', desc: 'Comprehensive risk assessment across all borrower profiles.' },
        { icon: '💰', title: 'Revenue Report', desc: 'Interest earnings, fees, and projected revenue analysis.' },
        { icon: '📋', title: 'Compliance Report', desc: 'Regulatory compliance status and audit trail summary.' },
        { icon: '🔍', title: 'Default Analysis', desc: 'Deep dive into default patterns and recovery rates.' },
    ];

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>Financial Reports</h1>
                <p>Generate and analyze comprehensive financial reports</p>
            </div>

            <div className="content-grid-3">
                {reportCards.map((r, i) => (
                    <div key={i} className="glass-card report-card" style={{ animationDelay: `${i * 50}ms` }}>
                        <div className="report-card-icon">{r.icon}</div>
                        <h4>{r.title}</h4>
                        <p>{r.desc}</p>
                        <div style={{ marginTop: '16px' }}>
                            <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                                Generate Report
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="content-grid">
                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Disbursement Trend</h3>
                    </div>
                    <AreaChartComponent data={monthlyData} dataKey="disbursed" color="#6366f1" height={280} />
                </div>

                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Repayment vs Defaults</h3>
                    </div>
                    <LineChartComponent
                        data={monthlyData}
                        xKey="month"
                        lines={[
                            { dataKey: 'repaid', color: '#06d6a0' },
                            { dataKey: 'defaults', color: '#ef476f' },
                        ]}
                        height={280}
                    />
                </div>
            </div>
        </div>
    );
}
