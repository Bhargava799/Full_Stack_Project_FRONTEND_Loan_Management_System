import { useState } from 'react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { users } from '../../data/mockData';
import '../pages.css';

export default function UserManagement() {
    const [selectedUser, setSelectedUser] = useState(null);

    const columns = [
        { key: 'avatar', label: '', render: v => <span style={{ fontSize: '24px' }}>{v}</span>, sortable: false },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role', render: v => <span style={{ textTransform: 'capitalize' }}>{v}</span> },
        { key: 'joinDate', label: 'Joined' },
        { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
        {
            key: 'id',
            label: 'Actions',
            sortable: false,
            render: (_, row) => (
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedUser(row)}>
                    View
                </button>
            ),
        },
    ];

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>User Management</h1>
                <p>Manage platform user accounts and permissions</p>
            </div>

            <div className="glass-card card-section">
                <DataTable
                    columns={columns}
                    data={users}
                    pageSize={8}
                    filterable
                    filterKey="name"
                />
            </div>

            <Modal
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                title="User Details"
                footer={
                    <>
                        <button className="btn btn-secondary btn-sm" onClick={() => setSelectedUser(null)}>Close</button>
                        <button className="btn btn-primary btn-sm">
                            {selectedUser?.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                    </>
                }
            >
                {selectedUser && (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <span style={{ fontSize: '48px' }}>{selectedUser.avatar}</span>
                            <h3 style={{ marginTop: '8px' }}>{selectedUser.name}</h3>
                            <p style={{ color: 'var(--text-tertiary)' }}>{selectedUser.email}</p>
                        </div>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <div className="detail-label">Role</div>
                                <div className="detail-value" style={{ textTransform: 'capitalize' }}>{selectedUser.role}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Status</div>
                                <div className="detail-value"><StatusBadge status={selectedUser.status} /></div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Joined</div>
                                <div className="detail-value">{selectedUser.joinDate}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">ID</div>
                                <div className="detail-value">{selectedUser.id}</div>
                            </div>
                            {selectedUser.creditScore && (
                                <div className="detail-item">
                                    <div className="detail-label">Credit Score</div>
                                    <div className="detail-value">{selectedUser.creditScore}</div>
                                </div>
                            )}
                            {selectedUser.income && (
                                <div className="detail-item">
                                    <div className="detail-label">Income</div>
                                    <div className="detail-value">${selectedUser.income.toLocaleString()}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
