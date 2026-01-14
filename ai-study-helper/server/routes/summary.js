const express = require('express');
const router = express.Router();
const { CohereClient } = require('cohere-ai');
const Note = require('../models/Note');
const protect = require('../middleware/auth');

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

// @route   POST /api/ai/summarize
// @desc    Generate a summary for a specific note
// @access  Private
router.post('/summarize', protect, async (req, res) => {
    const { noteId } = req.body;

    if (!noteId) {
        return res.status(400).json({ error: 'Note ID is required.' });
    }

    try {
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ error: 'Note not found.' });
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Not authorized.' });
        }

        const prompt = `Please provide a concise and clear summary of the following study notes. Highlight the key concepts and important details.

Notes:
${note.content}

Summary:`;

        const response = await cohere.chat({
            message: prompt,
        });

        res.json({ summary: response.text });

    } catch (error) {
        console.error('Cohere API Error:', error);
        res.status(500).json({ error: 'Failed to generate summary.', details: error.message });
    }
});

module.exports = router;
