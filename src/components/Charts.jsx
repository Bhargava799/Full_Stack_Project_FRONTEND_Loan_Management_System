import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';

const chartTooltipStyle = {
    backgroundColor: '#1a2235',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#f1f5f9',
    fontSize: '13px',
};

export function AreaChartComponent({ data, dataKey, xKey = 'month', color = '#06d6a0', height = 300, secondDataKey, secondColor = '#ef476f' }) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                    {secondDataKey && (
                        <linearGradient id={`grad-${secondColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={secondColor} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={secondColor} stopOpacity={0} />
                        </linearGradient>
                    )}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey={xKey} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.05)' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.05)' }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey={dataKey} stroke={color} fillOpacity={1} fill={`url(#grad-${color.replace('#', '')})`} strokeWidth={2} />
                {secondDataKey && (
                    <Area type="monotone" dataKey={secondDataKey} stroke={secondColor} fillOpacity={1} fill={`url(#grad-${secondColor.replace('#', '')})`} strokeWidth={2} />
                )}
            </AreaChart>
        </ResponsiveContainer>
    );
}

export function BarChartComponent({ data, dataKey, xKey = 'month', color = '#118ab2', height = 300, secondDataKey, secondColor = '#06d6a0' }) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey={xKey} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.05)' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.05)' }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend />
                <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
                {secondDataKey && <Bar dataKey={secondDataKey} fill={secondColor} radius={[4, 4, 0, 0]} />}
            </BarChart>
        </ResponsiveContainer>
    );
}

export function PieChartComponent({ data, height = 300 }) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={index} fill={entry.fill || '#06d6a0'} />
                    ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
        </ResponsiveContainer>
    );
}

export function LineChartComponent({ data, dataKey, xKey = 'month', color = '#6366f1', height = 300, lines }) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey={xKey} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.05)' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.05)' }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend />
                {lines ? lines.map(l => (
                    <Line key={l.dataKey} type="monotone" dataKey={l.dataKey} stroke={l.color} strokeWidth={2} dot={{ r: 3 }} />
                )) : (
                    <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
                )}
            </LineChart>
        </ResponsiveContainer>
    );
}
