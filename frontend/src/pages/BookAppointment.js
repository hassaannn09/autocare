import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { GiLightningSpanner } from 'react-icons/gi';
import { LuLayoutDashboard, LuCalendarDays, LuHistory, LuLogOut, LuArrowLeft, LuCar, LuClock } from 'react-icons/lu';

export default function BookAppointment() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const preSelected = location.state?.service || null;

    const [services, setServices] = useState([]);
    const [form, setForm] = useState({
        serviceId: preSelected?._id || '',
        date: '',
        timeSlot: '',
        make: '',
        model: '',
        year: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '01:00 PM', '02:00 PM',
        '03:00 PM', '04:00 PM', '05:00 PM'
    ];

    useEffect(() => {
        axios.get('autocare-backend5626.up.railway.app/api/services')
            .then(res => setServices(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(
                'autocare-backend5626.up.railway.app/api/appointments',
                {
                    serviceId: form.serviceId,
                    date: form.date,
                    timeSlot: form.timeSlot,
                    vehicleInfo: { make: form.make, model: form.model, year: form.year }
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate(`/payment/${res.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        }
        setLoading(false);
    };

    const handleLogout = () => { logout(); navigate('/login'); };
    const selectedService = services.find(s => s._id === form.serviceId);

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
                    <div style={styles.navItemActive}>
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
                    <button style={styles.backBtn} onClick={() => navigate('/customer')}>
                        <LuArrowLeft size={16} /> Back
                    </button>
                    <div>
                        <h1 style={styles.heading}>Book an Appointment</h1>
                        <p style={styles.subheading}>Fill in the details below to schedule your service</p>
                    </div>
                </div>

                <div style={styles.layout}>
                    <div style={styles.formCard}>
                        {error && <div style={styles.error}>{error}</div>}
                        <form onSubmit={handleSubmit}>

                            <p style={styles.sectionLabel}>Service Details</p>
                            <div style={styles.field}>
                                <label style={styles.label}>Select Service</label>
                                <select
                                    style={styles.input}
                                    value={form.serviceId}
                                    onChange={e => setForm({ ...form, serviceId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Choose a service --</option>
                                    {services.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} — Rs. {s.price}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={styles.row}>
                                <div style={styles.field}>
                                    <label style={styles.label}>Preferred Date</label>
                                    <input
                                        style={styles.input}
                                        type="date"
                                        value={form.date}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={e => setForm({ ...form, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Time Slot</label>
                                    <select
                                        style={styles.input}
                                        value={form.timeSlot}
                                        onChange={e => setForm({ ...form, timeSlot: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Select time --</option>
                                        {timeSlots.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <p style={styles.sectionLabel}>Vehicle Information</p>
                            <div style={styles.row}>
                                <div style={styles.field}>
                                    <label style={styles.label}>Make</label>
                                    <input
                                        style={styles.input}
                                        placeholder="Toyota"
                                        value={form.make}
                                        onChange={e => setForm({ ...form, make: e.target.value })}
                                        required
                                    />
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Model</label>
                                    <input
                                        style={styles.input}
                                        placeholder="Corolla"
                                        value={form.model}
                                        onChange={e => setForm({ ...form, model: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Year</label>
                                <input
                                    style={styles.input}
                                    placeholder="2020"
                                    value={form.year}
                                    onChange={e => setForm({ ...form, year: e.target.value })}
                                    required
                                />
                            </div>

                            <button style={loading ? styles.btnDisabled : styles.submitBtn} type="submit" disabled={loading}>
                                {loading ? 'Booking...' : 'Confirm Booking →'}
                            </button>
                        </form>
                    </div>

                    <div style={styles.summaryCard}>
                        <h3 style={styles.summaryTitle}>Booking Summary</h3>
                        {selectedService ? (
                            <>
                                <div style={styles.summaryServiceName}>{selectedService.name}</div>
                                <div style={styles.summaryMeta}>
                                    <LuClock size={13} color="#64748b" />
                                    <span>{selectedService.duration}</span>
                                </div>
                                <div style={styles.divider} />
                                <div style={styles.summaryRow}>
                                    <span style={styles.summaryLabel}>Date</span>
                                    <span style={styles.summaryValue}>{form.date || '—'}</span>
                                </div>
                                <div style={styles.summaryRow}>
                                    <span style={styles.summaryLabel}>Time</span>
                                    <span style={styles.summaryValue}>{form.timeSlot || '—'}</span>
                                </div>
                                <div style={styles.summaryRow}>
                                    <span style={styles.summaryLabel}>Vehicle</span>
                                    <span style={styles.summaryValue}>
                                        {form.make && form.model ? `${form.make} ${form.model} (${form.year})` : '—'}
                                    </span>
                                </div>
                                <div style={styles.divider} />
                                <div style={styles.totalRow}>
                                    <span style={styles.totalLabel}>Total</span>
                                    <span style={styles.totalValue}>Rs. {selectedService.price}</span>
                                </div>
                            </>
                        ) : (
                            <div style={styles.emptyState}>
                                <LuCar size={32} color="#cbd5e1" />
                                <p style={styles.emptyMsg}>Select a service to see summary</p>
                            </div>
                        )}
                    </div>
                </div>
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
    topBar: { display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' },
    backBtn: {
        display: 'flex', alignItems: 'center', gap: '6px',
        background: '#fff', border: '1px solid #e2e8f0',
        borderRadius: '8px', padding: '8px 14px',
        fontSize: '13px', color: '#475569', cursor: 'pointer',
        marginTop: '4px', flexShrink: 0,
    },
    heading: { fontSize: '22px', fontWeight: '700', color: '#0f172a' },
    subheading: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
    layout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' },
    formCard: {
        background: '#fff', borderRadius: '10px', padding: '28px',
        border: '1px solid #e2e8f0',
    },
    error: {
        background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca',
        padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px',
    },
    sectionLabel: {
        fontSize: '11px', fontWeight: '700', color: '#94a3b8',
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px',
    },
    field: { marginBottom: '16px', flex: 1 },
    row: { display: 'flex', gap: '16px' },
    label: { display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '13px', color: '#374151' },
    input: {
        width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0',
        borderRadius: '8px', fontSize: '13px', outline: 'none',
        background: '#fff', color: '#0f172a',
    },
    submitBtn: {
        width: '100%', padding: '12px', background: '#dc2626',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '14px', fontWeight: '600', marginTop: '8px',
        letterSpacing: '0.02em',
    },
    btnDisabled: {
        width: '100%', padding: '12px', background: '#fca5a5',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '14px', fontWeight: '600', marginTop: '8px',
    },
    summaryCard: {
        background: '#fff', borderRadius: '10px', padding: '24px',
        border: '1px solid #e2e8f0', position: 'sticky', top: '32px',
    },
    summaryTitle: { fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' },
    summaryServiceName: { fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' },
    summaryMeta: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b', marginBottom: '4px' },
    divider: { borderTop: '1px solid #f1f5f9', margin: '14px 0' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
    summaryLabel: { fontSize: '13px', color: '#64748b' },
    summaryValue: { fontSize: '13px', fontWeight: '500', color: '#0f172a', textAlign: 'right', maxWidth: '160px' },
    totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: '14px', fontWeight: '600', color: '#0f172a' },
    totalValue: { fontSize: '18px', fontWeight: '700', color: '#dc2626' },
    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '24px 0' },
    emptyMsg: { fontSize: '13px', color: '#94a3b8', textAlign: 'center' },
};