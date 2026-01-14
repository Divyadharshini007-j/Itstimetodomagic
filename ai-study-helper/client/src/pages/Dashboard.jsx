import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Upload, FileText, MessageSquare, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [notes, setNotes] = useState([]);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await api.get('/notes');
            setNotes(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);

        setLoading(true);
        try {
            await api.post('/notes/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchNotes();
            setFile(null);
            setTitle('');
            alert('Upload successful!');
        } catch (err) {
            console.error('Upload error details:', err);
            const message = err.response?.data?.message || err.message || 'Upload failed';
            alert(`Upload failed: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleStudy = (note) => {
        navigate('/study', { state: { noteId: note._id, noteTitle: note.title } });
    };

    return (
        <div style={{ width: '100%', maxWidth: '1200px', padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem' }}>Welcome, {user?.username}</h2>
                <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid #fca5a5', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Upload Section */}
                <div style={{ background: 'var(--card-bg)', backdropFilter: 'var(--glass-blur)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--card-border)', height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Upload size={20} /> Upload New Note</h3>
                    <form onSubmit={handleUpload}>
                        <div style={{ marginBottom: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Note Title (Optional)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.txt"
                                style={{ width: '100%', color: 'var(--text-secondary)' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !file}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 'bold', opacity: loading || !file ? 0.7 : 1 }}
                        >
                            {loading ? 'Uploading...' : 'Upload Note'}
                        </button>
                    </form>
                </div>

                {/* Notes List */}
                <div style={{ background: 'var(--card-bg)', backdropFilter: 'var(--glass-blur)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--card-border)' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={20} /> Your Study Notes</h3>
                    {notes.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No notes uploaded yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {notes.map((note) => (
                                <div key={note._id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem' }}>{note.title}</h4>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(note.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={() => handleStudy(note)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--secondary-color)', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}
                                    >
                                        <MessageSquare size={16} /> Study
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
