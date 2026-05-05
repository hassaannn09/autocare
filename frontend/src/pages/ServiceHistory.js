import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { GiLightningSpanner } from 'react-icons/gi';
import { LuLayoutDashboard, LuCalendarDays, LuHistory, LuLogOut, LuCar, LuClock, LuWrench } from 'react-icons/lu';

export default function ServiceHistory() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('autocare-backend5626.up.railway.app/api/appointments/my', {
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

    const statusStyles = {
        pending: { background: '#fef3c7', color: '#92400e' },
        confirmed: { background: '#dbeafe', color: '#1e40af' },
        completed: { background: '#dcfce7', color: '#166534' },
        cancelled: { background: '#fee2e2', color: '#991b1b' },
        'in-progress': { background: '#ede9fe', color: '#5b21b6' },
        done: { background: '#dcfce7', color: '#166534' },
    };

    const paymentStyles = {
        paid: { background: '#dcfce7', color: '#166534' },
        unpaid: { background: '#fee2e2', color: '#991b1b' },
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.sidebarLogo}>
                    <GiLightningSpanner size={22} color="#dc2626" />
                    <span>AutoCare</span>
                </div>
                <nav style={styles.nav}>
                    <div style={styles.navItem} onClick={() => navigate('/customer')}>
                        <LuLayoutDashboard size={17} /> Dashboard
                    </div>
                    <div style={styles.navItem} onClick={() => navigate('/book')}>
                        <LuCalendarDays size={17} /> Book Service
                    </div>
                    <div style={styles.navItemActive}>
                        <LuHistory size={17} /> My History
                    </div>
                </nav>
                <div style={styles.logoutBtn} onClick={handleLogout}>
                    <LuLogOut size={17} /> Logout
                </div>
            </div>

            <div style={styles.main}>
                <h1 style={styles.heading}>Service History</h1>
                <p style={styles.subheading}>All your past and upcoming appointments</p>

                {loading ? (
                    <div style={styles.emptyBox}>
                        <p style={styles.emptyMsg}>Loading...</p>
                    </div>
                ) : appointments.length === 0 ? (
                    <div style={styles.emptyBox}>
                        <div style={styles.emptyIconWrap}>
                            <LuCar size={32} color="#94a3b8" />
                        </div>
                        <p style={styles.emptyTitle}>No appointments yet</p>
                        <p style={styles.emptyMsg}>Book your first service to get started</p>
                        <button style={styles.bookBtn} onClick={() => navigate('/book')}>
                            Book a Service
                        </button>
                    </div>
                ) : (
                    <div style={styles.list}>
                        {appointments.map(appt => (
                            <div key={appt._id} style={styles.card}>
                                <div style={styles.cardLeft}>
                                    <div style={styles.iconWrap}>
                                        <LuCar size={22} color="#dc2626" />
                                    </div>
                                    <div>
                                        <h3 style={styles.serviceName}>{appt.service?.name}</h3>
                                        <div style={styles.metaRow}>
                                            <LuClock size={12} color="#94a3b8" />
                                            <span style={styles.metaText}>
                                                {new Date(appt.date).toLocaleDateString('en-PK', {
                                                    weekday: 'short', year: 'numeric',
                                                    month: 'short', day: 'numeric'
                                                })} — {appt.timeSlot}
                                            </span>
                                        </div>
                                        <div style={styles.metaRow}>
                                            <LuCar size={12} color="#94a3b8" />
                                            <span style={styles.metaText}>
                                                {appt.vehicleInfo?.make} {appt.vehicleInfo?.model} {appt.vehicleInfo?.year}
                                            </span>
                                        </div>
                                        {appt.mechanic && (
                                            <div style={styles.metaRow}>
                                                <LuWrench size={12} color="#94a3b8" />
                                                <span style={styles.metaText}>Mechanic: {appt.mechanic?.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={styles.cardRight}>
                                    <div style={styles.badgeRow}>
                                        <span style={{ ...styles.badge, ...statusStyles[appt.status] }}>
                                            {appt.status}
                                        </span>
                                        <span style={{ ...styles.badge, ...paymentStyles[appt.paymentStatus] }}>
                                            {appt.paymentStatus}
                                        </span>
                                    </div>
                                    <p style={styles.amount}>Rs. {appt.totalAmount}</p>
                                    {appt.paymentStatus === 'unpaid' && (
                                        <button
                                            style={styles.payNowBtn}
                                            onClick={() => navigate(`/payment/${appt._id}`)}
                                        >
                                            Pay Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
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
    nav: { flex: 1, padding: '12px 0' },
    navItem: {
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '11px 20px', cursor: 'pointer', fontSize: '13px',
        color: '#94a3b8', borderLeft: '3px solid transparent',
    },
    navItemActive: {
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '11px 20px', cursor: 'pointer', fontSize: '13px',
        color: '#fff', background: '#1e293b', borderLeft: '3px solid #dc2626',
        fontWeight: '500',
    },
    logoutBtn: {
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '14px 20px', color: '#64748b', cursor: 'pointer',
        fontSize: '13px', borderTop: '1px solid #1e293b',
    },
    main: { marginLeft: '240px', flex: 1, padding: '32px' },
    heading: { fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' },
    subheading: { fontSize: '13px', color: '#64748b', marginBottom: '28px' },
    list: { display: 'flex', flexDirection: 'column', gap: '12px' },
    card: {
        background: '#fff', borderRadius: '10px', padding: '20px 24px',
        border: '1px solid #e2e8f0', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
    },
    cardLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
    iconWrap: {
        width: '44px', height: '44px', background: '#fef2f2',
        borderRadius: '10px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0,
    },
    serviceName: { fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' },
    metaRow: { display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' },
    metaText: { fontSize: '12px', color: '#64748b' },
    cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' },
    badgeRow: { display: 'flex', gap: '6px' },
    badge: { fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' },
    amount: { fontSize: '16px', fontWeight: '700', color: '#0f172a' },
    payNowBtn: {
        padding: '7px 16px', background: '#dc2626', color: '#fff',
        border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
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
    bookBtn: {
        padding: '10px 22px', background: '#dc2626', color: '#fff',
        border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
        marginTop: '4px',
    },
};