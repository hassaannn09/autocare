import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { GiLightningSpanner } from 'react-icons/gi';
import { LuLayoutDashboard, LuCalendarDays, LuHistory, LuLogOut, LuCircleCheck, LuCreditCard, LuSmartphone, LuBanknote, LuCar } from 'react-icons/lu';

export default function Payment() {
    const { token, logout } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState(null);
    const [method, setMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [paid, setPaid] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('autocare-backend5626.up.railway.app/api/appointments/my', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            const found = res.data.find(a => a._id === id);
            setAppointment(found);
        }).catch(err => console.log(err));
    }, [id, token]);

    const handlePay = async () => {
        setLoading(true);
        setError('');
        try {
            await axios.put(
                `autocare-backend5626.up.railway.app/api/appointments/pay/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPaid(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed');
        }
        setLoading(false);
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const paymentMethods = [
        { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard', icon: <LuCreditCard size={20} /> },
        { id: 'easypaisa', label: 'Easypaisa', sub: 'Mobile wallet', icon: <LuSmartphone size={20} /> },
        { id: 'cash', label: 'Cash on Arrival', sub: 'Pay at the center', icon: <LuBanknote size={20} /> },
    ];

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
                    <div style={styles.navItem} onClick={() => navigate('/history')}>
                        <LuHistory size={17} /> My History
                    </div>
                </nav>
                <div style={styles.logoutBtn} onClick={handleLogout}>
                    <LuLogOut size={17} /> Logout
                </div>
            </div>

            <div style={styles.main}>
                {paid ? (
                    <div style={styles.successBox}>
                        <div style={styles.successIconWrap}>
                            <LuCircleCheck size={52} color="#16a34a" />
                        </div>
                        <h2 style={styles.successTitle}>Payment Successful</h2>
                        <p style={styles.successMsg}>Your appointment has been confirmed. We'll see you soon!</p>
                        <button style={styles.successBtn} onClick={() => navigate('/history')}>
                            View My Appointments
                        </button>
                    </div>
                ) : (
                    <>
                        <h1 style={styles.heading}>Complete Payment</h1>
                        <p style={styles.subheading}>Choose your preferred payment method</p>

                        {error && <div style={styles.error}>{error}</div>}

                        <div style={styles.layout}>
                            <div style={styles.card}>
                                <p style={styles.sectionLabel}>Payment Method</p>
                                <div style={styles.methodList}>
                                    {paymentMethods.map(m => (
                                        <div
                                            key={m.id}
                                            style={method === m.id ? styles.methodActive : styles.methodItem}
                                            onClick={() => setMethod(m.id)}
                                        >
                                            <div style={styles.methodIconWrap}>{m.icon}</div>
                                            <div style={{ flex: 1 }}>
                                                <p style={styles.methodLabel}>{m.label}</p>
                                                <p style={styles.methodSub}>{m.sub}</p>
                                            </div>
                                            <div style={method === m.id ? styles.radioActive : styles.radio} />
                                        </div>
                                    ))}
                                </div>

                                {method === 'card' && (
                                    <div style={styles.cardFields}>
                                        <div style={styles.field}>
                                            <label style={styles.label}>Card Number</label>
                                            <input style={styles.input} placeholder="1234 5678 9012 3456" maxLength={19} />
                                        </div>
                                        <div style={styles.row}>
                                            <div style={styles.field}>
                                                <label style={styles.label}>Expiry</label>
                                                <input style={styles.input} placeholder="MM/YY" />
                                            </div>
                                            <div style={styles.field}>
                                                <label style={styles.label}>CVV</label>
                                                <input style={styles.input} placeholder="123" maxLength={3} />
                                            </div>
                                        </div>
                                        <div style={styles.field}>
                                            <label style={styles.label}>Cardholder Name</label>
                                            <input style={styles.input} placeholder="Muhammad Ali" />
                                        </div>
                                    </div>
                                )}

                                {method === 'easypaisa' && (
                                    <div style={styles.cardFields}>
                                        <div style={styles.field}>
                                            <label style={styles.label}>Easypaisa Number</label>
                                            <input style={styles.input} placeholder="03XX-XXXXXXX" />
                                        </div>
                                    </div>
                                )}

                                {method === 'cash' && (
                                    <div style={styles.cashNote}>
                                        Please bring exact change when you arrive at the service center.
                                    </div>
                                )}

                                <button
                                    style={loading ? styles.btnDisabled : styles.payBtn}
                                    onClick={handlePay}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : `Pay Rs. ${appointment?.totalAmount || '—'}`}
                                </button>
                            </div>

                            <div style={styles.summaryCard}>
                                <p style={styles.sectionLabel}>Order Summary</p>
                                {appointment ? (
                                    <>
                                        <div style={styles.summaryServiceName}>{appointment.service?.name}</div>
                                        <div style={styles.divider} />
                                        <div style={styles.summaryRow}>
                                            <span style={styles.summaryLabel}>Date</span>
                                            <span style={styles.summaryValue}>
                                                {new Date(appointment.date).toLocaleDateString('en-PK')}
                                            </span>
                                        </div>
                                        <div style={styles.summaryRow}>
                                            <span style={styles.summaryLabel}>Time</span>
                                            <span style={styles.summaryValue}>{appointment.timeSlot}</span>
                                        </div>
                                        <div style={styles.summaryRow}>
                                            <span style={styles.summaryLabel}>Vehicle</span>
                                            <span style={styles.summaryValue}>
                                                {appointment.vehicleInfo?.make} {appointment.vehicleInfo?.model} {appointment.vehicleInfo?.year}
                                            </span>
                                        </div>
                                        <div style={styles.summaryRow}>
                                            <span style={styles.summaryLabel}>Status</span>
                                            <span style={styles.statusBadge}>{appointment.status}</span>
                                        </div>
                                        <div style={styles.divider} />
                                        <div style={styles.totalRow}>
                                            <span style={styles.totalLabel}>Total</span>
                                            <span style={styles.totalValue}>Rs. {appointment.totalAmount}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div style={styles.emptyState}>
                                        <LuCar size={28} color="#cbd5e1" />
                                        <p style={styles.emptyMsg}>Loading...</p>
                                    </div>
                                )}
                            </div>
                        </div>
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
        padding: '24px 20px', fontSize: '18px', fontWeight: '700',
        color: '#fff', borderBottom: '1px solid #1e293b',
    },
    nav: { flex: 1, padding: '12px 0' },
    navItem: {
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '11px 20px', cursor: 'pointer', fontSize: '13px',
        color: '#94a3b8', borderLeft: '3px solid transparent',
    },
    logoutBtn: {
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '14px 20px', color: '#64748b', cursor: 'pointer',
        fontSize: '13px', borderTop: '1px solid #1e293b',
    },
    main: { marginLeft: '240px', flex: 1, padding: '32px' },
    heading: { fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' },
    subheading: { fontSize: '13px', color: '#64748b', marginBottom: '24px' },
    error: {
        background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca',
        padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px',
    },
    layout: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' },
    card: {
        background: '#fff', borderRadius: '10px', padding: '28px',
        border: '1px solid #e2e8f0',
    },
    sectionLabel: {
        fontSize: '11px', fontWeight: '700', color: '#94a3b8',
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px',
    },
    methodList: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' },
    methodItem: {
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '14px 16px', border: '1.5px solid #e2e8f0',
        borderRadius: '10px', cursor: 'pointer',
    },
    methodActive: {
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '14px 16px', border: '1.5px solid #dc2626',
        borderRadius: '10px', cursor: 'pointer', background: '#fef2f2',
    },
    methodIconWrap: { color: '#475569' },
    methodLabel: { fontSize: '14px', fontWeight: '500', color: '#0f172a' },
    methodSub: { fontSize: '12px', color: '#94a3b8', marginTop: '2px' },
    radio: { width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #cbd5e1', flexShrink: 0 },
    radioActive: { width: '16px', height: '16px', borderRadius: '50%', border: '5px solid #dc2626', flexShrink: 0 },
    cardFields: { marginBottom: '20px' },
    field: { marginBottom: '14px', flex: 1 },
    row: { display: 'flex', gap: '16px' },
    label: { display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '13px', color: '#374151' },
    input: {
        width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0',
        borderRadius: '8px', fontSize: '14px', outline: 'none',
    },
    cashNote: {
        background: '#f8fafc', border: '1px solid #e2e8f0',
        borderRadius: '8px', padding: '14px',
        fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: '1.6',
    },
    payBtn: {
        width: '100%', padding: '13px', background: '#dc2626',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '15px', fontWeight: '600',
    },
    btnDisabled: {
        width: '100%', padding: '13px', background: '#fca5a5',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '15px', fontWeight: '600',
    },
    summaryCard: {
        background: '#fff', borderRadius: '10px', padding: '24px',
        border: '1px solid #e2e8f0', position: 'sticky', top: '32px',
    },
    summaryServiceName: { fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' },
    divider: { borderTop: '1px solid #f1f5f9', margin: '14px 0' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
    summaryLabel: { fontSize: '13px', color: '#64748b' },
    summaryValue: { fontSize: '13px', fontWeight: '500', color: '#0f172a', textAlign: 'right' },
    statusBadge: {
        fontSize: '12px', padding: '2px 10px', borderRadius: '20px',
        background: '#fef3c7', color: '#92400e', fontWeight: '500',
    },
    totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: '14px', fontWeight: '600', color: '#0f172a' },
    totalValue: { fontSize: '18px', fontWeight: '700', color: '#dc2626' },
    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 0' },
    emptyMsg: { fontSize: '13px', color: '#94a3b8' },
    successBox: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '70vh', gap: '16px', textAlign: 'center',
    },
    successIconWrap: {
        width: '88px', height: '88px', background: '#f0fdf4',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    successTitle: { fontSize: '24px', fontWeight: '700', color: '#0f172a' },
    successMsg: { fontSize: '14px', color: '#64748b', maxWidth: '320px' },
    successBtn: {
        padding: '12px 28px', background: '#0f172a', color: '#fff',
        border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
        marginTop: '8px',
    },
};