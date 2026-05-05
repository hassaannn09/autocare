import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { GiLightningSpanner } from 'react-icons/gi';
import { LuTriangleAlert  } from 'react-icons/lu';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('https://autocare-backend5626.up.railway.app/api/auth/login', form);
            login(res.data.user, res.data.token);
            if (res.data.user.role === 'admin') navigate('/admin');
            else if (res.data.user.role === 'mechanic') navigate('/mechanic');
            else navigate('/customer');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Try again.');
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
                <p style={styles.subtitle}>Sign in to your account</p>

                {error && (
                    <div style={styles.error}>
                        <LuTriangleAlert  size={16} style={{ marginRight: '8px', flexShrink: 0 }} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
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
                    <button style={loading ? styles.buttonDisabled : styles.button} type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={styles.link}>
                    Don't have an account?{' '}
                    <Link to="/register" style={styles.linkText}>Create one</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh', background: '#0f172a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    card: {
        background: '#fff', padding: '40px', borderRadius: '12px',
        width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
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
    field: { marginBottom: '16px' },
    label: { display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '13px', color: '#374151' },
    input: {
        width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0',
        borderRadius: '8px', fontSize: '14px', outline: 'none',
        transition: 'border 0.2s', color: '#0f172a',
    },
    button: {
        width: '100%', padding: '12px', background: '#dc2626',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '15px', fontWeight: '600', marginTop: '8px',
        letterSpacing: '0.01em',
    },
    buttonDisabled: {
        width: '100%', padding: '12px', background: '#fca5a5',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '15px', fontWeight: '600', marginTop: '8px',
    },
    link: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' },
    linkText: { color: '#dc2626', fontWeight: '600', textDecoration: 'none' },
}; 