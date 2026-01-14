const express = require('express');
const router = express.Router();
const { CohereClient } = require('cohere-ai');
const Note = require('../models/Note');
const protect = require('../middleware/auth');

// Initialize Cohere Client
const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

// @route   POST /api/ask
// @desc    Ask a question based on notes (Text provided or Note ID)
// @access  Private (Revised to require auth for context persistence)
router.post('/ask', protect, async (req, res) => {
    let { notes, noteId, question } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'Question is required.' });
    }

    try {
        // If noteId is provided, fetch content from DB
        if (noteId) {
            const noteFn = await Note.findById(noteId);
            if (!noteFn) {
                return res.status(404).json({ error: 'Note not found.' });
            }
            // Check ownership
            if (noteFn.user.toString() !== req.user.id) {
                return res.status(401).json({ error: 'Not authorized to access this note.' });
            }
            notes = noteFn.content;
        }

        if (!notes) {
            return res.status(400).json({ error: 'Notes content or valid Note ID is required.' });
        }

        const prompt = `You are a helpful study assistant. Use ONLY the provided notes to answer the question. If the answer is not contained in the notes, state that you cannot answer based on the provided information.

Notes:
${notes}

Question:
${question}

Answer:`;

        const response = await cohere.chat({
            message: prompt,
        });

        res.json({ answer: response.text });

    } catch (error) {
        console.error('Cohere API Error:', error);
        res.status(500).json({ error: 'Failed to generate answer from AI.', details: error.message });
    }
});

module.exports = router;
