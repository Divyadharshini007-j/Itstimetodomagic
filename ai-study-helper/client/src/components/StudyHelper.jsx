import React, { useState } from 'react';
import AnswerDisplay from './AnswerDisplay';
import './StudyHelper.css';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, FileText, Sparkles, Mic, MicOff } from 'lucide-react';

const StudyHelper = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { noteId, noteTitle } = location.state || {};

    const [notes, setNotes] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState(null);
    const [isListening, setIsListening] = useState(false);

    const toggleListening = () => {
        if (isListening) {
            setIsListening(false);
            window.speechRecognition?.stop();
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support voice input. Please use Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuestion(prev => (prev ? prev + ' ' + transcript : transcript));
        };

        window.speechRecognition = recognition; // Keep ref to stop later
        recognition.start();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((!noteId && !notes.trim()) || !question.trim()) {
            setError('Please provide a question and notes context.');
            return;
        }

        setLoading(true);
        setError(null);
        setAnswer(null);

        try {
            const payload = noteId ? { noteId, question } : { notes, question };
            const response = await api.post('/ask', payload);
            setAnswer(response.data.answer);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to get answer');
        } finally {
            setLoading(false);
        }
    };

    const handleSummarize = async () => {
        if (!noteId) return;
        setLoading(true);
        setError(null);
        setSummary(null);

        try {
            const response = await api.post('/ai/summarize', { noteId });
            setSummary(response.data.summary);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to get summary');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="study-helper-card" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            <button
                onClick={() => navigate('/dashboard')}
                style={{ position: 'absolute', top: '-40px', left: '0', background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            {noteId ? (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', border: '1px solid var(--primary-color)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                        <FileText size={20} /> {noteTitle}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Asking usage this note as context.
                    </p>
                    <button
                        onClick={handleSummarize}
                        disabled={loading}
                        style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: 'var(--secondary-color)', color: 'white', fontSize: '0.9rem' }}
                    >
                        <Sparkles size={16} /> Generate Summary
                    </button>
                    {summary && (
                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem' }}>
                            <h4 style={{ marginBottom: '0.5rem' }}>Summary:</h4>
                            <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>{summary}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="form-group">
                    <label htmlFor="notes">Study Notes (Paste Text)</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Paste your study notes or text here..."
                        rows={6}
                    />
                </div>
            )}

            <form onSubmit={handleSubmit} className="study-form">
                <div className="form-group">
                    <label htmlFor="question">Your Question</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            id="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder={noteId ? "Ask specifically about this note..." : "What do you want to know?"}
                            style={{ width: '100%', paddingRight: '40px' }}
                        />
                        <button
                            type="button"
                            onClick={toggleListening}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: isListening ? 'var(--accent-color)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                padding: '5px'
                            }}
                            title={isListening ? "Stop listening" : "Speak question"}
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="submit-btn" style={{ background: 'var(--primary-color)' }}>
                    {loading ? 'Thinking...' : 'Ask AI'}
                </button>
            </form>

            <AnswerDisplay answer={answer} loading={loading && !summary} error={error} />
        </div>
    );
};

export default StudyHelper;
