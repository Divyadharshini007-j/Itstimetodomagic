import React from 'react';
import { Volume2, Square } from 'lucide-react';

const AnswerDisplay = ({ answer, loading, error }) => {
    if (loading) {
        return (
            <div className="answer-container loading">
                <div className="loader"></div>
                <p>Analyzing notes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="answer-container error">
                <p>{error}</p>
            </div>
        );
    }

    if (!answer) return null;

    const [isSpeaking, setIsSpeaking] = React.useState(false);
    const speechRef = React.useRef(null);

    const handleSpeak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(answer);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        speechRef.current = utterance;

        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    return (
        <div className="answer-container success">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>AI Answer:</h3>
                <button
                    onClick={handleSpeak}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: isSpeaking ? 'var(--accent-color)' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    title={isSpeaking ? "Stop reading" : "Read aloud"}
                >
                    {isSpeaking ? (
                        <>Stop <Square size={16} fill="currentColor" /></>
                    ) : (
                        <>Read <Volume2 size={18} /></>
                    )}
                </button>
            </div>
            <div className="answer-text">{answer}</div>
        </div>
    );
};

export default AnswerDisplay;
