import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { GiLightningSpanner } from 'react-icons/gi';
import { LuLayoutDashboard, LuCalendarDays, LuHistory, LuLogOut, LuCar, LuClock, LuBanknote } from 'react-icons/lu';

export default function CustomerDashboard() {
    const { user, token, logout } = useAuth();
    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('autocare-backend5626.up.railway.app/api/services')
            .then(res => setServices(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.sidebarLogo}>
                    <GiLightningSpanner size={22} color="#dc2626" />
                    <span>AutoCare</span>
                </div>
                <div style={styles.userInfo}>
                    <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
                    <div>
                        <p style={styles.userName}>{user?.name}</p>
                        <p style={styles.userRole}>Customer</p>
                    </div>
                </div>
                <nav style={styles.nav}>
                    <div style={styles.navItemActive}>
                        <LuLayoutDashboard size={17} /> Dashboard
                    </div>
                    <div style={styles.navItem} onClick={() => navigate('/book')}>
                        <LuCalendarDays size={17} /> Book Service
                    </div>
                    <div style={styles.navItem} onClick={() => navigate('/history')}>
                        <LuHistory size={17} /> My History
                    </div>
                </nav>
                <div style={styles.logoutBtn} onClick={handleLogout}>
                    <LuLogOut size={17} /> Logout
                </div>
            </div>

            <div style={styles.main}>
                <div style={styles.topBar}>
                    <div>
                        <h1 style={styles.heading}>Welcome back, {user?.name}</h1>
                        <p style={styles.subheading}>Choose a service to get started</p>
                    </div>
                </div>

                <h2 style={styles.sectionTitle}>Available Services</h2>
                <div style={styles.grid}>
                    {services.map(service => (
                        <div key={service._id} style={styles.card}>
                            <div style={styles.cardIconWrap}>
                                <LuCar size={26} color="#dc2626" />
                            </div>
                            <h3 style={styles.cardTitle}>{service.name}</h3>
                            <p style={styles.cardDesc}>{service.description}</p>
                            <div style={styles.cardMeta}>
                                <span style={styles.metaItem}>
                                    <LuClock size={13} style={{ marginRight: '4px' }} />
                                    {service.duration}
                                </span>
                                <span style={styles.metaItem}>
                                    <LuBanknote size={13} style={{ marginRight: '4px' }} />
                                    Rs. {service.price}
                                </span>
                            </div>
                            <button
                                style={styles.bookBtn}
                                onClick={() => navigate('/book', { state: { service } })}
                            >
                                Book Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', minHeight: '100vh', background: '#f1f5f9' },
    sidebar: {
        width: '240px', background: '#0f172a', color: '#fff',
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
    navItem: {
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '11px 20px', cursor: 'pointer', fontSize: '13px',
        color: '#94a3b8', borderLeft: '3px solid transparent',
        transition: 'all 0.15s',
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
    topBar: { marginBottom: '28px' },
    heading: { fontSize: '22px', fontWeight: '700', color: '#0f172a' },
    subheading: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
    sectionTitle: {
        fontSize: '15px', fontWeight: '600', color: '#0f172a',
        marginBottom: '16px', textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    grid: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '16px',
    },
    card: {
        background: '#fff', borderRadius: '10px', padding: '22px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0',
    },
    cardIconWrap: {
        width: '48px', height: '48px', background: '#fef2f2',
        borderRadius: '10px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: '14px',
    },
    cardTitle: { fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' },
    cardDesc: { fontSize: '13px', color: '#64748b', marginBottom: '14px', lineHeight: '1.6' },
    cardMeta: { display: 'flex', gap: '16px', marginBottom: '16px' },
    metaItem: {
        display: 'flex', alignItems: 'center', fontSize: '12px',
        color: '#64748b', fontWeight: '500',
    },
    bookBtn: {
        width: '100%', padding: '10px', background: '#0f172a',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '13px', fontWeight: '600', letterSpacing: '0.02em',
    },
};