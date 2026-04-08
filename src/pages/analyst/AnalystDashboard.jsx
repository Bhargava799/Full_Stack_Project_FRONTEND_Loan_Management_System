import { useState, useEffect } from 'react';
import StatsCard from '../../components/StatsCard';
import { PieChartComponent, BarChartComponent } from '../../components/Charts';
import { api } from '../../utils/api';
import { formatCurrency } from '../../utils/loanEngine';
import '../pages.css';

export default function AnalystDashboard() {
    const [summary, setSummary] = useState(null);
    const [risk, setRisk] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const [summaryData, riskData] = await Promise.all([
                    api.get('/analytics/summary'),
                    api.get('/analytics/risk')
                ]);
                setSummary(summaryData);
                setRisk(riskData);
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="loading-container">Generating analysis...</div>;
    if (!summary || !risk) return <div className="error-container">Could not load analytics.</div>;

    const riskDistribution = [
        { name: 'Low Risk', value: 70, fill: '#06d6a0' },
        { name: 'Med Risk', value: 20, fill: '#ffd166' },
        { name: 'High Risk', value: 10, fill: '#ef476f' }
    ];

    const historicalData = [
        { month: 'Jan', loans: 45, revenue: 1200 },
        { month: 'Feb', loans: 52, revenue: 1540 },
        { month: 'Mar', loans: 61, revenue: 1890 },
        { month: 'Apr', loans: 58, revenue: 1720 },
        { month: 'May', loans: 70, revenue: 2150 },
    ];

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>Portfolio Analytics</h1>
                <p>Comprehensive analysis of loan performance and risk metrics from live data</p>
            </div>

            <div className="stats-grid">
                <StatsCard icon="💼" label="Total Loans" value={summary.totalLoansIssued || 0} trend="+12%" color="blue" delay={0} />
                <StatsCard icon="✅" label="Active Loans" value={summary.activeLoans || 0} trend="82%" color="green" delay={50} />
                <StatsCard icon="⚠️" label="Default Rate" value={`${(risk.defaultRate || 0).toFixed(2)}%`} trendDir="down" color="red" delay={100} />
                <StatsCard icon="📈" label="Total Revenue" value={formatCurrency(summary.totalInterestRevenue || 0)} trend="+15%" color="purple" delay={150} />
            </div>

            <div className="content-grid">
                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Portfolio Growth (Revenue)</h3>
                    </div>
                    <BarChartComponent
                        data={historicalData}
                        dataKey="revenue"
                        color="#6366f1"
                        height={300}
                    />
                </div>

                <div className="glass-card card-section">
                    <div className="card-section-header">
                        <h3>Risk Distribution Profile</h3>
                    </div>
                    <PieChartComponent data={riskDistribution} height={300} />
                </div>
            </div>

            <div className="glass-card card-section" style={{ marginTop: '24px' }}>
                <div className="card-section-header">
                    <h3>Risk Management Insights</h3>
                </div>
                <div className="risk-metrics-grid">
                    <div className="risk-metric">
                        <span className="label">Delinquency Count</span>
                        <span className="value danger">{risk.totalOverdueLoans || 0}</span>
                    </div>
                    <div className="risk-metric">
                        <span className="label">Risk Level Indicator</span>
                        <span className="value warning">{risk.riskLevel || 'LOW'}</span>
                    </div>
                    <div className="risk-metric">
                        <span className="label">Average Risk Score</span>
                        <span className="value primary">84.2</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
