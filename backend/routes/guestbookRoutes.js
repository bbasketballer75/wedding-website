import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getGuestbookEntries,
  createGuestbookEntry,
  validateGuestbookEntry,
} from '../controllers/guestbookController.js';

// Rate limiter: max 5 guestbook posts per IP per hour
const guestbookLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many guestbook entries from this IP, please try again later.',
});

const router = express.Router();

/**
 * @swagger
 * /guestbook:
 *   get:
 *     summary: Retrieve all guestbook entries
 *     tags: [Guestbook]
 *     responses:
 *       200:
 *         description: List of guestbook entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GuestbookEntry'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new guestbook entry
 *     tags: [Guestbook]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 description: Guest name (optional, defaults to Anonymous)
 *               message:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 500
 *                 description: Guest message
 *     responses:
 *       201:
 *         description: Guestbook entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GuestbookEntry'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route('/')
  .get(getGuestbookEntries)
  .post(guestbookLimiter, validateGuestbookEntry, createGuestbookEntry);

export default router;
