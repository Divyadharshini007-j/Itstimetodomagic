import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', background: 'var(--card-bg)', backdropFilter: 'var(--glass-blur)', borderRadius: '1rem', border: '1px solid var(--card-border)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2rem' }}>Register</h2>
            {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }}
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 'bold', fontSize: '1rem' }}
                >
                    Sign Up
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--secondary-color)', textDecoration: 'none' }}>Login</Link>
            </p>
        </div>
    );
};

export default Register;
