import { useState, useMemo } from 'react';
import './DataTable.css';

export default function DataTable({ columns, data, pageSize = 8, filterable = false, filterKey }) {
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState('');

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const filteredData = useMemo(() => {
        if (!filter || !filterKey) return data;
        return data.filter(row => {
            const val = row[filterKey];
            return val && String(val).toLowerCase().includes(filter.toLowerCase());
        });
    }, [data, filter, filterKey]);

    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [filteredData, sortKey, sortDir]);

    const totalPages = Math.ceil(sortedData.length / pageSize);
    const pageData = sortedData.slice(page * pageSize, (page + 1) * pageSize);

    return (
        <div>
            {filterable && (
                <div className="table-filter">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={filter}
                        onChange={e => { setFilter(e.target.value); setPage(0); }}
                    />
                </div>
            )}

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                    className={sortKey === col.key ? 'sorted' : ''}
                                >
                                    {col.label}
                                    {sortKey === col.key && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            pageData.map((row, idx) => (
                                <tr key={row.id || idx}>
                                    {columns.map(col => (
                                        <td key={col.key}>
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="table-pagination">
                    <div className="table-pagination-info">
                        Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sortedData.length)} of {sortedData.length}
                    </div>
                    <div className="table-pagination-controls">
                        <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>← Prev</button>
                        <span className="page-num">{page + 1} / {totalPages}</span>
                        <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next →</button>
                    </div>
                </div>
            )}
        </div>
    );
}
