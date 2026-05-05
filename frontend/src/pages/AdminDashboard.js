import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { GiLightningSpanner } from 'react-icons/gi';
import {
    LuLayoutDashboard, LuLogOut, LuCar, LuUsers, LuWrench,
    LuPlus, LuPencil, LuTrash2, LuUserCheck, LuCircleCheck,
    LuCircleX, LuTrendingUp, LuClock
} from 'react-icons/lu';
import React, { useEffect, useState, useCallback } from 'react';

export default function AdminDashboard() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', price: '', duration: '' });
    const [error, setError] = useState('');

    useEffect(() => { fetchData(); }, [token]);

    const fetchData = async () => {
        try {
            const [apptRes, svcRes, mechRes, pendingRes] = await Promise.all([
                axios.get('autocare-backend5626.up.railway.app/api/appointments/all', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('autocare-backend5626.up.railway.app/api/services'),
                axios.get('autocare-backend5626.up.railway.app/api/users/mechanics', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('autocare-backend5626.up.railway.app/api/users/pending', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
            ]);
            setAppointments(apptRes.data);
            setServices(svcRes.data);
            setMechanics(mechRes.data);
            setPendingUsers(pendingRes.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingService) {
                await axios.put(`autocare-backend5626.up.railway.app/api/services/${editingService._id}`, form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('autocare-backend5626.up.railway.app/api/services', form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setForm({ name: '', description: '', price: '', duration: '' });
            setShowForm(false);
            setEditingService(null);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save service');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this service?')) return;
        try {
            await axios.delete(`autocare-backend5626.up.railway.app/api/services/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) { console.log(err); }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setForm({ name: service.name, description: service.description, price: service.price, duration: service.duration });
        setShowForm(true);
        setActiveTab('services');
    };

    const handleStatusChange = async (id, status) => {
        try {
            await axios.put(`autocare-backend5626.up.railway.app/api/appointments/status/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) { console.log(err); }
    };

    const handleAssignMechanic = async (appointmentId, mechanicId) => {
        try {
            await axios.put(`autocare-backend5626.up.railway.app/api/appointments/assign/${appointmentId}`, { mechanicId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) { console.log(err); }
    };

    const handleUserStatus = async (userId, status) => {
        try {
            await axios.put(`autocare-backend5626.up.railway.app/api/users/${userId}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) { console.log(err); }
    };

    const statusStyles = {
        pending: { background: '#fef3c7', color: '#92400e' },
        confirmed: { background: '#dbeafe', color: '#1e40af' },
        completed: { background: '#dcfce7', color: '#166534' },
        cancelled: { background: '#fee2e2', color: '#991b1b' },
    };

    const totalRevenue = appointments
        .filter(a => a.paymentStatus === 'paid')
        .reduce((sum, a) => sum + a.totalAmount, 0);

    const navItems = [
        { id: 'overview', icon: <LuLayoutDashboard size={17} />, label: 'Overview' },
        { id: 'appointments', icon: <LuCar size={17} />, label: 'Appointments' },
        { id: 'services', icon: <LuWrench size={17} />, label: 'Services' },
        { id: 'users', icon: <LuUserCheck size={17} />, label: `Approvals ${pendingUsers.length > 0 ? `(${pendingUsers.length})` : ''}` },
    ];


    const fetchData = useCallback(async () => {
        try {
            const [apptRes, svcRes, mechRes, pendingRes] = await Promise.all([
                axios.get('http://autocare-backend5626.up.railway.app/api/appointments/all', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://autocare-backend5626.up.railway.app/api/services'),
                axios.get('http://autocare-backend5626.up.railway.app/api/users/mechanics', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://autocare-backend5626.up.railway.app/api/users/pending', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
            ]);
            setAppointments(apptRes.data);
            setServices(svcRes.data);
            setMechanics(mechRes.data);
            setPendingUsers(pendingRes.data);
        } catch (err) {
            console.log(err);
        }
    }, [token]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.sidebarLogo}>
                    <GiLightningSpanner size={36} color="#dc2626" />
                    <span>AutoCare</span>
                </div>
                <div style={styles.adminBadge}>Admin Panel</div>
                <nav style={styles.nav}>
                    {navItems.map(item => (
                        <div
                            key={item.id}
                            style={activeTab === item.id ? styles.navItemActive : styles.navItem}
                            onClick={() => setActiveTab(item.id)}
                        >
                            {item.icon} {item.label}
                        </div>
                    ))}
                </nav>
                <div style={styles.logoutBtn} onClick={handleLogout}>
                    <LuLogOut size={17} /> Logout
                </div>
            </div>

            <div style={styles.main}>

                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                    <>
                        <h1 style={styles.heading}>Dashboard Overview</h1>
                        <div style={styles.statsGrid}>
                            {[
                                { icon: <LuCar size={26} color="#dc2626" />, label: 'Total Appointments', value: appointments.length, bg: '#fef2f2' },
                                { icon: <LuWrench size={26} color="#2563eb" />, label: 'Services Offered', value: services.length, bg: '#eff6ff' },
                                { icon: <LuTrendingUp size={26} color="#16a34a" />, label: 'Revenue Collected', value: `Rs. ${totalRevenue.toLocaleString()}`, bg: '#f0fdf4' },
                                { icon: <LuClock size={26} color="#d97706" />, label: 'Pending Approvals', value: pendingUsers.length, bg: '#fffbeb' },
                            ].map((stat, i) => (
                                <div key={i} style={styles.statCard}>
                                    <div style={{ ...styles.statIconWrap, background: stat.bg }}>{stat.icon}</div>
                                    <div>
                                        <p style={styles.statLabel}>{stat.label}</p>
                                        <p style={styles.statValue}>{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h2 style={styles.sectionTitle}>Recent Appointments</h2>
                        <div style={styles.tableWrap}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>{['Customer', 'Service', 'Date', 'Amount', 'Status'].map(h => (
                                        <th key={h} style={styles.th}>{h}</th>
                                    ))}</tr>
                                </thead>
                                <tbody>
                                    {appointments.slice(0, 5).map(appt => (
                                        <tr key={appt._id}>
                                            <td style={styles.td}>{appt.customer?.name}</td>
                                            <td style={styles.td}>{appt.service?.name}</td>
                                            <td style={styles.td}>{new Date(appt.date).toLocaleDateString('en-PK')}</td>
                                            <td style={styles.td}>Rs. {appt.totalAmount}</td>
                                            <td style={styles.td}>
                                                <span style={{ ...styles.badge, ...statusStyles[appt.status] }}>{appt.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* APPOINTMENTS */}
                {activeTab === 'appointments' && (
                    <>
                        <h1 style={styles.heading}>All Appointments</h1>
                        <div style={styles.tableWrap}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>{['Customer', 'Service', 'Date & Time', 'Vehicle', 'Amount', 'Payment', 'Mechanic', 'Status'].map(h => (
                                        <th key={h} style={styles.th}>{h}</th>
                                    ))}</tr>
                                </thead>
                                <tbody>
                                    {appointments.map(appt => (
                                        <tr key={appt._id}>
                                            <td style={styles.td}>
                                                <div style={styles.tdMain}>{appt.customer?.name}</div>
                                                <div style={styles.tdSub}>{appt.customer?.email}</div>
                                            </td>
                                            <td style={styles.td}>{appt.service?.name}</td>
                                            <td style={styles.td}>
                                                <div style={styles.tdMain}>{new Date(appt.date).toLocaleDateString('en-PK')}</div>
                                                <div style={styles.tdSub}>{appt.timeSlot}</div>
                                            </td>
                                            <td style={styles.td}>{appt.vehicleInfo?.make} {appt.vehicleInfo?.model}</td>
                                            <td style={styles.td}>Rs. {appt.totalAmount}</td>
                                            <td style={styles.td}>
                                                <span style={{
                                                    ...styles.badge,
                                                    ...(appt.paymentStatus === 'paid'
                                                        ? { background: '#dcfce7', color: '#166534' }
                                                        : { background: '#fee2e2', color: '#991b1b' })
                                                }}>{appt.paymentStatus}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <select
                                                    style={styles.selectSm}
                                                    value={appt.mechanic?._id || ''}
                                                    onChange={e => handleAssignMechanic(appt._id, e.target.value)}
                                                >
                                                    <option value="">Unassigned</option>
                                                    {mechanics.map(m => (
                                                        <option key={m._id} value={m._id}>{m.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td style={styles.td}>
                                                <select
                                                    style={styles.selectSm}
                                                    value={appt.status}
                                                    onChange={e => handleStatusChange(appt._id, e.target.value)}
                                                >
                                                    {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* SERVICES */}
                {activeTab === 'services' && (
                    <>
                        <div style={styles.tabHeader}>
                            <h1 style={styles.heading}>Manage Services</h1>
                            <button style={styles.addBtn} onClick={() => {
                                setShowForm(!showForm);
                                setEditingService(null);
                                setForm({ name: '', description: '', price: '', duration: '' });
                            }}>
                                <LuPlus size={14} /> Add Service
                            </button>
                        </div>

                        {showForm && (
                            <div style={styles.formCard}>
                                <h3 style={styles.formTitle}>{editingService ? 'Edit Service' : 'New Service'}</h3>
                                {error && <div style={styles.errorBox}>{error}</div>}
                                <form onSubmit={handleServiceSubmit}>
                                    <div style={styles.formRow}>
                                        <div style={styles.field}>
                                            <label style={styles.label}>Service Name</label>
                                            <input style={styles.input} value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                placeholder="e.g. Oil Change" required />
                                        </div>
                                        <div style={styles.field}>
                                            <label style={styles.label}>Duration</label>
                                            <input style={styles.input} value={form.duration}
                                                onChange={e => setForm({ ...form, duration: e.target.value })}
                                                placeholder="e.g. 30 mins" required />
                                        </div>
                                    </div>
                                    <div style={styles.field}>
                                        <label style={styles.label}>Description</label>
                                        <input style={styles.input} value={form.description}
                                            onChange={e => setForm({ ...form, description: e.target.value })}
                                            placeholder="Brief description" required />
                                    </div>
                                    <div style={styles.field}>
                                        <label style={styles.label}>Price (Rs.)</label>
                                        <input style={styles.input} type="number" value={form.price}
                                            onChange={e => setForm({ ...form, price: e.target.value })}
                                            placeholder="e.g. 2500" required />
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button style={styles.submitBtn} type="submit">
                                            {editingService ? 'Update Service' : 'Add Service'}
                                        </button>
                                        <button style={styles.cancelBtn} type="button"
                                            onClick={() => { setShowForm(false); setEditingService(null); }}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div style={styles.serviceGrid}>
                            {services.map(service => (
                                <div key={service._id} style={styles.serviceCard}>
                                    <div style={styles.serviceTop}>
                                        <h3 style={styles.serviceName}>{service.name}</h3>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button style={styles.editBtn} onClick={() => handleEdit(service)}>
                                                <LuPencil size={14} />
                                            </button>
                                            <button style={styles.deleteBtn} onClick={() => handleDelete(service._id)}>
                                                <LuTrash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <p style={styles.serviceDesc}>{service.description}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={styles.servicePrice}>Rs. {service.price}</span>
                                        <span style={styles.serviceDuration}>{service.duration}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* USER APPROVALS */}
                {activeTab === 'users' && (
                    <>
                        <h1 style={styles.heading}>Pending Approvals</h1>
                        {pendingUsers.length === 0 ? (
                            <div style={styles.emptyBox}>
                                <LuUsers size={40} color="#cbd5e1" />
                                <p style={styles.emptyMsg}>No pending approvals</p>
                            </div>
                        ) : (
                            <div style={styles.tableWrap}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>{['Name', 'Email', 'Role', 'Registered', 'Action'].map(h => (
                                            <th key={h} style={styles.th}>{h}</th>
                                        ))}</tr>
                                    </thead>
                                    <tbody>
                                        {pendingUsers.map(u => (
                                            <tr key={u._id}>
                                                <td style={styles.td}>{u.name}</td>
                                                <td style={styles.td}>{u.email}</td>
                                                <td style={styles.td}>
                                                    <span style={{
                                                        ...styles.badge,
                                                        background: u.role === 'admin' ? '#ede9fe' : '#dbeafe',
                                                        color: u.role === 'admin' ? '#5b21b6' : '#1e40af'
                                                    }}>{u.role}</span>
                                                </td>
                                                <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString('en-PK')}</td>
                                                <td style={styles.td}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button style={styles.approveBtn}
                                                            onClick={() => handleUserStatus(u._id, 'approved')}>
                                                            <LuCircleCheck size={14} /> Approve
                                                        </button>
                                                        <button style={styles.rejectBtn}
                                                            onClick={() => handleUserStatus(u._id, 'rejected')}>
                                                            <LuCircleX size={14} /> Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', minHeight: '100vh', background: '#f1f5f9' },
    sidebar: {
        width: '240px', background: '#0f172a',
        display: 'flex', flexDirection: 'column', padding: '0',
        position: 'fixed', height: '100vh',
    },
    sidebarLogo: {
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '22px 20px 14px', fontSize: '18px', fontWeight: '700', color: '#fff',
    },
    adminBadge: {
        margin: '0 20px 8px', fontSize: '11px', padding: '4px 10px',
        background: '#dc2626', color: '#fff', borderRadius: '6px',
        fontWeight: '600', textAlign: 'center', letterSpacing: '0.05em',
    },
    nav: { flex: 1, padding: '12px 0', borderTop: '1px solid #1e293b' },
    navItem: {
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '11px 20px', cursor: 'pointer', fontSize: '13px',
        color: '#94a3b8', borderLeft: '3px solid transparent',
    },
    navItemActive: {
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '11px 20px', cursor: 'pointer', fontSize: '13px',
        color: '#fff', background: '#1e293b', borderLeft: '3px solid #dc2626', fontWeight: '500',
    },
    logoutBtn: {
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '14px 20px', color: '#64748b', cursor: 'pointer',
        fontSize: '13px', borderTop: '1px solid #1e293b',
    },
    main: { marginLeft: '240px', flex: 1, padding: '32px' },
    heading: { fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '24px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' },
    statCard: {
        background: '#fff', borderRadius: '10px', padding: '20px',
        border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px',
    },
    statIconWrap: {
        width: '52px', height: '52px', borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    statLabel: { fontSize: '12px', color: '#64748b', marginBottom: '4px' },
    statValue: { fontSize: '20px', fontWeight: '700', color: '#0f172a' },
    sectionTitle: { fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '14px' },
    tableWrap: { background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
        padding: '11px 16px', background: '#f8fafc', fontSize: '11px',
        fontWeight: '700', color: '#64748b', textAlign: 'left',
        borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.06em',
        whiteSpace: 'nowrap',
    },
    td: { padding: '13px 16px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f1f5f9' },
    tdMain: { fontWeight: '500', color: '#0f172a' },
    tdSub: { fontSize: '12px', color: '#94a3b8', marginTop: '2px' },
    badge: { fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' },
    selectSm: {
        padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: '6px',
        fontSize: '12px', outline: 'none', background: '#fff', color: '#374151',
    },
    tabHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    addBtn: {
        display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px',
        background: '#dc2626', color: '#fff', border: 'none',
        borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    },
    formCard: {
        background: '#fff', borderRadius: '10px', padding: '24px',
        border: '1px solid #e2e8f0', marginBottom: '24px',
    },
    formTitle: { fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' },
    errorBox: {
        background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca',
        padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px',
    },
    formRow: { display: 'flex', gap: '16px' },
    field: { marginBottom: '14px', flex: 1 },
    label: { display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '13px', color: '#374151' },
    input: {
        width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0',
        borderRadius: '8px', fontSize: '13px', outline: 'none', color: '#0f172a',
    },
    submitBtn: {
        padding: '10px 20px', background: '#dc2626', color: '#fff',
        border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    },
    cancelBtn: {
        padding: '10px 20px', background: '#f1f5f9', color: '#475569',
        border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
    },
    serviceGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' },
    serviceCard: {
        background: '#fff', borderRadius: '10px', padding: '20px', border: '1px solid #e2e8f0',
    },
    serviceTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
    serviceName: { fontSize: '15px', fontWeight: '600', color: '#0f172a' },
    serviceDesc: { fontSize: '13px', color: '#64748b', marginBottom: '14px', lineHeight: '1.6' },
    servicePrice: { fontWeight: '700', color: '#dc2626', fontSize: '15px' },
    serviceDuration: { fontSize: '12px', color: '#94a3b8', alignSelf: 'center' },
    editBtn: {
        padding: '6px 8px', background: '#eff6ff', color: '#2563eb',
        border: 'none', borderRadius: '6px', cursor: 'pointer',
    },
    deleteBtn: {
        padding: '6px 8px', background: '#fee2e2', color: '#dc2626',
        border: 'none', borderRadius: '6px', cursor: 'pointer',
    },
    approveBtn: {
        display: 'flex', alignItems: 'center', gap: '5px',
        padding: '6px 12px', background: '#f0fdf4', color: '#16a34a',
        border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '12px',
        fontWeight: '500', cursor: 'pointer',
    },
    rejectBtn: {
        display: 'flex', alignItems: 'center', gap: '5px',
        padding: '6px 12px', background: '#fff1f2', color: '#e11d48',
        border: '1px solid #fecdd3', borderRadius: '6px', fontSize: '12px',
        fontWeight: '500', cursor: 'pointer',
    },
    emptyBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '60px' },
    emptyMsg: { fontSize: '14px', color: '#94a3b8' },
};