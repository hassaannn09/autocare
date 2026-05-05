import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { GiLightningSpanner } from 'react-icons/gi';
import {
    LuLayoutDashboard, LuLogOut, LuCar, LuWrench,
    LuClock, LuCircleCheck, LuLoaderCircle
} from 'react-icons/lu';

export default function MechanicDashboard() {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        axios.get('autocare-backend5626.up.railway.app/api/appointments/assigned', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            setAppointments(res.data);
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        });
    }, [token]);

    const handleLogout = () => { logout(); navigate('/login'); };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(
                `autocare-backend5626.up.railway.app/api/appointments/job-status/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAppointments(prev =>
                prev.map(a => a._id === id ? { ...a, status } : a)
            );
        } catch (err) {
            console.log(err);
        }
    };

    const filtered = activeTab === 'all'
        ? appointments
        : appointments.filter(a => a.status === activeTab);

    const statusConfig = {
        pending: { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
        confirmed: { bg: '#dbeafe', color: '#1e40af', label: 'Confirmed' },
        'in-progress': { bg: '#ede9fe', color: '#5b21b6', label: 'In Progress' },
        done: { bg: '#dcfce7', color: '#166534', label: 'Done' },
        completed: { bg: '#dcfce7', color: '#166534', label: 'Completed' },
        cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
    };

    const stats = [
        { label: 'Total Assigned', value: appointments.length, color: '#dc2626', bg: '#fef2f2', icon: <LuCar size={24} color="#dc2626" /> },
        { label: 'In Progress', value: appointments.filter(a => a.status === 'in-progress').length, color: '#7c3aed', bg: '#f5f3ff', icon: <LuLoaderCircle size={24} color="#7c3aed" /> },
        { label: 'Completed', value: appointments.filter(a => a.status === 'done' || a.status === 'completed').length, color: '#16a34a', bg: '#f0fdf4', icon: <LuCircleCheck size={24} color="#16a34a" /> },
        { label: 'Pending', value: appointments.filter(a => a.status === 'pending').length, color: '#d97706', bg: '#fffbeb', icon: <LuClock size={24} color="#d97706" /> },
    ];

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.sidebarLogo}>
                    <GiLightningSpanner size={22} color="#dc2626" />
                    <span>AutoCare</span>
                </div>
                <div style={styles.userInfo}>
                    <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
                    <div>
                        <p style={styles.userName}>{user?.name}</p>
                        <p style={styles.userRole}>Mechanic</p>
                    </div>
                </div>
                <nav style={styles.nav}>
                    <div style={styles.navItemActive}>
                        <LuLayoutDashboard size={17} /> My Jobs
                    </div>
                </nav>
                <div style={styles.logoutBtn} onClick={handleLogout}>
                    <LuLogOut size={17} /> Logout
                </div>
            </div>

            {/* Main */}
            <div style={styles.main}>
                <div style={styles.topBar}>
                    <div>
                        <h1 style={styles.heading}>My Assigned Jobs</h1>
                        <p style={styles.subheading}>Manage and update your service jobs</p>
                    </div>
                </div>

                {/* Stats */}
                <div style={styles.statsGrid}>
                    {stats.map((stat, i) => (
                        <div key={i} style={styles.statCard}>
                            <div style={{ ...styles.statIconWrap, background: stat.bg }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={styles.statLabel}>{stat.label}</p>
                                <p style={{ ...styles.statValue, color: stat.color }}>{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div style={styles.filterRow}>
                    {['all', 'pending', 'in-progress', 'done'].map(tab => (
                        <button
                            key={tab}
                            style={activeTab === tab ? styles.filterBtnActive : styles.filterBtn}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'all' ? 'All Jobs' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Job Cards */}
                {loading ? (
                    <div style={styles.emptyBox}>
                        <p style={styles.emptyMsg}>Loading jobs...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={styles.emptyBox}>
                        <div style={styles.emptyIconWrap}>
                            <LuWrench size={32} color="#94a3b8" />
                        </div>
                        <p style={styles.emptyTitle}>No jobs found</p>
                        <p style={styles.emptyMsg}>
                            {activeTab === 'all' ? 'No jobs assigned yet' : `No jobs with status "${activeTab}"`}
                        </p>
                    </div>
                ) : (
                    <div style={styles.jobList}>
                        {filtered.map(appt => {
                            const sc = statusConfig[appt.status] || statusConfig.pending;
                            return (
                                <div key={appt._id} style={styles.jobCard}>
                                    <div style={styles.jobLeft}>
                                        <div style={styles.jobIconWrap}>
                                            <LuCar size={22} color="#dc2626" />
                                        </div>
                                        <div>
                                            <h3 style={styles.jobTitle}>{appt.service?.name}</h3>
                                            <div style={styles.jobMeta}>
                                                <LuClock size={12} color="#94a3b8" />
                                                <span style={styles.jobMetaText}>
                                                    {new Date(appt.date).toLocaleDateString('en-PK', {
                                                        weekday: 'short', year: 'numeric',
                                                        month: 'short', day: 'numeric'
                                                    })} — {appt.timeSlot}
                                                </span>
                                            </div>
                                            <div style={styles.jobMeta}>
                                                <LuCar size={12} color="#94a3b8" />
                                                <span style={styles.jobMetaText}>
                                                    {appt.vehicleInfo?.make} {appt.vehicleInfo?.model} ({appt.vehicleInfo?.year})
                                                </span>
                                            </div>
                                            <div style={styles.jobMeta}>
                                                <span style={styles.jobMetaText}>
                                                    Customer: <strong>{appt.customer?.name}</strong>
                                                </span>
                                            </div>
                                            <div style={styles.jobMeta}>
                                                <span style={styles.jobMetaText}>
                                                    Duration: {appt.service?.duration}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={styles.jobRight}>
                                        <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
                                            {sc.label}
                                        </span>

                                        {appt.status !== 'done' && appt.status !== 'completed' && appt.status !== 'cancelled' && (
                                            <div style={styles.actionBtns}>
                                                {appt.status === 'pending' || appt.status === 'confirmed' ? (
                                                    <button
                                                        style={styles.startBtn}
                                                        onClick={() => handleStatusUpdate(appt._id, 'in-progress')}
                                                    >
                                                        <LuLoaderCircle size={14} /> Start Job
                                                    </button>
                                                ) : null}
                                                {appt.status === 'in-progress' ? (
                                                    <button
                                                        style={styles.doneBtn}
                                                        onClick={() => handleStatusUpdate(appt._id, 'done')}
                                                    >
                                                        <LuCircleCheck size={14} /> Mark Done
                                                    </button>
                                                ) : null}
                                            </div>
                                        )}

                                        {(appt.status === 'done' || appt.status === 'completed') && (
                                            <div style={styles.completedNote}>
                                                <LuCircleCheck size={14} color="#16a34a" />
                                                <span>Job completed</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
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
        padding: '24px 20px', fontSize: '18px', fontWeight: '700',
        color: '#fff', borderBottom: '1px solid #1e293b',
    },
    userInfo: {
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '16px 20px', borderBottom: '1px solid #1e293b',
    },
    avatar: {
        width: '36px', height: '36px', borderRadius: '50%',
        background: '#dc2626', color: '#fff', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontWeight: '700', fontSize: '15px', flexShrink: 0,
    },
    userName: { fontSize: '13px', fontWeight: '600', color: '#f1f5f9' },
    userRole: { fontSize: '11px', color: '#64748b', marginTop: '2px' },
    nav: { flex: 1, padding: '12px 0' },
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
    topBar: { marginBottom: '28px' },
    heading: { fontSize: '22px', fontWeight: '700', color: '#0f172a' },
    subheading: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' },
    statCard: {
        background: '#fff', borderRadius: '10px', padding: '18px',
        border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px',
    },
    statIconWrap: {
        width: '48px', height: '48px', borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    statLabel: { fontSize: '12px', color: '#64748b', marginBottom: '3px' },
    statValue: { fontSize: '22px', fontWeight: '700' },
    filterRow: { display: 'flex', gap: '8px', marginBottom: '20px' },
    filterBtn: {
        padding: '7px 16px', background: '#fff', border: '1px solid #e2e8f0',
        borderRadius: '8px', fontSize: '13px', color: '#64748b', cursor: 'pointer', fontWeight: '500',
    },
    filterBtnActive: {
        padding: '7px 16px', background: '#0f172a', border: '1px solid #0f172a',
        borderRadius: '8px', fontSize: '13px', color: '#fff', cursor: 'pointer', fontWeight: '500',
    },
    jobList: { display: 'flex', flexDirection: 'column', gap: '14px' },
    jobCard: {
        background: '#fff', borderRadius: '10px', padding: '20px 24px',
        border: '1px solid #e2e8f0', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
    },
    jobLeft: { display: 'flex', alignItems: 'flex-start', gap: '16px' },
    jobIconWrap: {
        width: '44px', height: '44px', background: '#fef2f2',
        borderRadius: '10px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0, marginTop: '2px',
    },
    jobTitle: { fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' },
    jobMeta: { display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' },
    jobMetaText: { fontSize: '12px', color: '#64748b' },
    jobRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' },
    statusBadge: { fontSize: '12px', padding: '4px 12px', borderRadius: '20px', fontWeight: '500' },
    actionBtns: { display: 'flex', gap: '8px' },
    startBtn: {
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 14px', background: '#ede9fe', color: '#5b21b6',
        border: 'none', borderRadius: '8px', fontSize: '13px',
        fontWeight: '600', cursor: 'pointer',
    },
    doneBtn: {
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 14px', background: '#dc2626', color: '#fff',
        border: 'none', borderRadius: '8px', fontSize: '13px',
        fontWeight: '600', cursor: 'pointer',
    },
    completedNote: {
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '13px', color: '#16a34a', fontWeight: '500',
    },
    emptyBox: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '12px', marginTop: '80px',
    },
    emptyIconWrap: {
        width: '72px', height: '72px', background: '#f1f5f9',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    emptyTitle: { fontSize: '16px', fontWeight: '600', color: '#0f172a' },
    emptyMsg: { fontSize: '13px', color: '#94a3b8' },
};