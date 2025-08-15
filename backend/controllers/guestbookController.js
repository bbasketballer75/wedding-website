import GuestbookEntry from '../models/GuestbookEntry.firestore.js';
import asyncHandler from '../utils/asyncHandler.js';
import { body, validationResult } from 'express-validator';

// Validation middleware for guestbook entries
const validateGuestbookEntry = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters')
    .escape(), // Escape HTML entities
  body('message')
    .notEmpty()
    .withMessage('A message is required to sign the guestbook.')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters')
    .escape(), // Escape HTML entities
];

/**
 * @desc    Get all guestbook entries
 * @route   GET /api/guestbook
 * @access  Public
 */
const getGuestbookEntries = asyncHandler(async (req, res) => {
  const entries = await GuestbookEntry.findAll();
  res.json(entries);
});

/**
 * @desc    Add a new guestbook entry
 * @route   POST /api/guestbook
 * @access  Public
 */
const createGuestbookEntry = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(
      errors
        .array()
        .map((err) => err.msg)
        .join(', ')
    );
  }

  const { name, message } = req.body;

  if (!message || message.trim() === '') {
    res.status(400);
    throw new Error('A message is required to sign the guestbook.');
  }

  const entry = new GuestbookEntry({
    name: name || 'Anonymous',
    message: message.trim(),
  });

  const saved = await entry.save();
  // Always return a plain object, even if the mock returns a class instance
  res.status(201).json({
    name: saved.name,
    message: saved.message,
    id: saved.id,
    timestamp: saved.timestamp,
  });
});

export { validateGuestbookEntry, getGuestbookEntries, createGuestbookEntry };
