import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GiLightningSpanner } from 'react-icons/gi';
import { LuTriangleAlert, LuCircleCheck } from 'react-icons/lu';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', inviteCode: '' });
    const [pwdFocus, setPwdFocus] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await axios.post('https://autocare-backend5626.up.railway.app/api/auth/register', form);
            if (form.role === 'customer') {
                navigate('/login');
            } else {
                setSuccess(res.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logoRow}>
                    <GiLightningSpanner size={52} color="#dc2626" />
                    <h1 style={styles.title}>AutoCare</h1>
                </div>
                <p style={styles.subtitle}>Create your account</p>

                {error && (
                    <div style={styles.error}>
                        <LuTriangleAlert size={16} style={{ marginRight: '8px', flexShrink: 0 }} />
                        {error}
                    </div>
                )}

                {success && (
                    <div style={styles.successMsg}>
                        <LuCircleCheck size={16} style={{ marginRight: '8px', flexShrink: 0 }} />
                        {success}
                    </div>
                )}

                {!success && (
                    <form onSubmit={handleSubmit}>
                        <div style={styles.field}>
                            <label style={styles.label}>Full Name</label>
                            <input
                                style={styles.input}
                                placeholder="Muhammad Ali"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Email address</label>
                            <input
                                style={styles.input}
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Password</label>
                            <input
                                style={styles.input}
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Account Type</label>
                            <select
                                style={styles.input}
                                value={form.role}
                                onChange={e => setForm({ ...form, role: e.target.value, inviteCode: '' })}
                            >
                                <option value="customer">Customer</option>
                                <option value="mechanic">Mechanic</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {(form.role === 'admin') && (
                            <div style={styles.field}>
                                <label style={styles.label}>Admin Invite Code</label>
                                <input
                                    style={styles.input}
                                    type="password"
                                    placeholder="Enter invite code"
                                    value={form.inviteCode}
                                    onChange={e => setForm({ ...form, inviteCode: e.target.value })}
                                    required
                                />
                                <p style={styles.hint}>Contact your system administrator for the invite code.</p>
                            </div>
                        )}

                        {form.role !== 'customer' && (
                            <div style={styles.pendingNote}>
                                Your account will require admin approval before you can log in.
                            </div>
                        )}

                        <button style={loading ? styles.buttonDisabled : styles.button} type="submit" disabled={loading}>
                            {loading ? 'Creating account...' : 'Register'}
                        </button>
                    </form>
                )}

                {success && (
                    <button style={styles.button} onClick={() => navigate('/login')}>
                        Back to Login
                    </button>
                )}

                <p style={styles.link}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.linkText}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh', background: '#0f172a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
    },
    card: {
        background: '#fff', padding: '40px', borderRadius: '12px',
        width: '100%', maxWidth: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    },
    logoRow: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '10px', marginBottom: '6px',
    },
    title: { fontSize: '24px', fontWeight: '700', color: '#0f172a' },
    subtitle: { textAlign: 'center', color: '#64748b', marginBottom: '28px', fontSize: '14px' },
    error: {
        display: 'flex', alignItems: 'center',
        background: '#fef2f2', color: '#991b1b',
        border: '1px solid #fecaca',
        padding: '10px 14px', borderRadius: '8px',
        marginBottom: '16px', fontSize: '13px', fontWeight: '500',
    },
    successMsg: {
        display: 'flex', alignItems: 'center',
        background: '#f0fdf4', color: '#166534',
        border: '1px solid #bbf7d0',
        padding: '10px 14px', borderRadius: '8px',
        marginBottom: '16px', fontSize: '13px', fontWeight: '500',
    },
    field: { marginBottom: '16px' },
    label: { display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '13px', color: '#374151' },
    input: {
        width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0',
        borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#0f172a',
    },
    hint: { fontSize: '12px', color: '#94a3b8', marginTop: '4px' },
    pendingNote: {
        background: '#fffbeb', border: '1px solid #fde68a',
        borderRadius: '8px', padding: '10px 14px',
        fontSize: '13px', color: '#92400e', marginBottom: '16px',
    },
    button: {
        width: '100%', padding: '12px', background: '#dc2626',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '15px', fontWeight: '600', marginTop: '4px',
    },
    buttonDisabled: {
        width: '100%', padding: '12px', background: '#fca5a5',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '15px', fontWeight: '600', marginTop: '4px',
    },
    link: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' },
    linkText: { color: '#dc2626', fontWeight: '600', textDecoration: 'none' },
};