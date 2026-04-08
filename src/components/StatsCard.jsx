import './StatsCard.css';

export default function StatsCard({ icon, label, value, trend, trendDir, color = 'green', delay = 0 }) {
    return (
        <div className="stats-card glass-card" style={{ animationDelay: `${delay}ms` }}>
            <div className="stats-card-header">
                <div className={`stats-card-icon ${color}`}>{icon}</div>
                {trend && (
                    <div className={`stats-card-trend ${trendDir || 'up'}`}>
                        {trendDir === 'down' ? '↓' : '↑'} {trend}
                    </div>
                )}
            </div>
            <div className="stats-card-value">{value}</div>
            <div className="stats-card-label">{label}</div>
            <div className={`stats-card-decoration ${color}`} />
        </div>
    );
}
