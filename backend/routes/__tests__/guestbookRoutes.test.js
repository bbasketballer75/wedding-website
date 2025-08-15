import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// ESM-safe mocking for guestbookController
const getGuestbookEntriesMock = jest.fn();
const createGuestbookEntryMock = jest.fn();
const validateGuestbookEntryMock = jest.fn((req, res, next) => next());
await jest.unstable_mockModule('../../controllers/guestbookController.js', () => ({
  getGuestbookEntries: getGuestbookEntriesMock,
  createGuestbookEntry: createGuestbookEntryMock,
  validateGuestbookEntry: validateGuestbookEntryMock,
}));

const app = express();
app.use(express.json());
// Inline route definitions using controller mocks
import rateLimit from 'express-rate-limit';
const guestbookLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many guestbook entries from this IP, please try again later.',
});
app.get('/guestbook', getGuestbookEntriesMock);
app.post('/guestbook', guestbookLimiter, validateGuestbookEntryMock, createGuestbookEntryMock);

describe('Guestbook Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getGuestbookEntriesMock.mockReset();
    createGuestbookEntryMock.mockReset();
    validateGuestbookEntryMock.mockReset();
    validateGuestbookEntryMock.mockImplementation((req, res, next) => next());
  });

  describe('GET /guestbook', () => {
    it('should fetch guestbook entries successfully', async () => {
      getGuestbookEntriesMock.mockImplementation((req, res) =>
        res.status(200).json([{ message: 'Test Entry', name: 'Test User' }])
      );

      const res = await request(app).get('/guestbook');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([{ message: 'Test Entry', name: 'Test User' }]);
    });

    it('should handle server errors', async () => {
      getGuestbookEntriesMock.mockImplementation((req, res) =>
        res.status(500).json({ message: 'Server error' })
      );

      const res = await request(app).get('/guestbook');
      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });

  describe('POST /guestbook', () => {
    it('should create a new guestbook entry', async () => {
      const newEntry = { name: 'John Doe', message: 'Great wedding!' };
      createGuestbookEntryMock.mockImplementation((req, res) =>
        res.status(201).json({ ...newEntry, timestamp: new Date() })
      );

      const res = await request(app).post('/guestbook').send(newEntry);

      expect(res.statusCode).toEqual(201);
      expect(res.body.name).toEqual('John Doe');
      expect(res.body.message).toEqual('Great wedding!');
    });

    it('should handle missing message', async () => {
      createGuestbookEntryMock.mockImplementation((req, res) =>
        res.status(400).json({ message: 'A message is required to sign the guestbook.' })
      );

      const res = await request(app).post('/guestbook').send({ name: 'John Doe' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('message is required');
    });

    it('should handle empty message', async () => {
      createGuestbookEntryMock.mockImplementation((req, res) =>
        res.status(400).json({ message: 'A message is required to sign the guestbook.' })
      );

      const res = await request(app).post('/guestbook').send({ name: 'John Doe', message: '   ' });

      expect(res.statusCode).toEqual(400);
    });

    it('should handle server errors during creation', async () => {
      createGuestbookEntryMock.mockImplementation((req, res) =>
        res.status(500).json({ message: 'Database error' })
      );

      const res = await request(app)
        .post('/guestbook')
        .send({ name: 'John Doe', message: 'Great wedding!' });

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual('Database error');
    });
  });
});
