const express = require('express');
const router = express.Router();
const multer = require('multer');
const mult = require('multer');

const pdfParse = require('pdf-parse');
// pdf-parse loaded

const fs = require('fs');
const Note = require('../models/Note');
const protect = require('../middleware/auth');

// Configure Multer
const upload = multer({ dest: 'uploads/' });

// @route   POST /api/notes/upload
// @desc    Upload a note (Text or PDF)
// @access  Private
router.post('/upload', protect, upload.single('file'), async (req, res) => {
    try {
        console.log('File upload request received:', req.file); // DEBUG LOG

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        let content = '';

        if (req.file.mimetype === 'application/pdf') {
            try {
                const dataBuffer = fs.readFileSync(req.file.path);
                const data = await pdfParse(dataBuffer);
                content = data.text;
            } catch (pdfError) {
                console.error('PDF Parse Error:', pdfError);
                return res.status(400).json({ message: 'Failed to parse PDF file. Reason: ' + pdfError.message });
            }
        } else {
            // Assume text file
            try {
                content = fs.readFileSync(req.file.path, 'utf8');
            } catch (readError) {
                console.error('File Read Error:', readError);
                return res.status(500).json({ message: 'Failed to read file content.' });
            }
        }

        console.log('File content extracted length:', content.length); // DEBUG LOG

        // Clean up uploaded file
        try {
            fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
            console.error('Failed to delete temp file:', unlinkError);
        }

        const note = await Note.create({
            user: req.user.id,
            title: req.body.title || req.file.originalname,
            content: content,
            originalFilename: req.file.originalname,
            subject: req.body.subject || 'General',
        });

        res.status(201).json(note);
    } catch (error) {
        console.error('Upload Route Error:', error);
        res.status(500).json({ message: 'Server error parsing file: ' + error.message });
    }
});

// @route   GET /api/notes
// @desc    Get all notes for authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/notes/:id
// @desc    Get single note
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Ensure user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
