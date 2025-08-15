import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// ESM-compliant mocking: mock before import
jest.unstable_mockModule('../../controllers/albumController.js', () => ({
  getAlbumMedia: jest.fn(),
  uploadMedia: jest.fn(),
  getAllAlbumMedia: jest.fn(),
  moderateMedia: jest.fn(),
}));
jest.unstable_mockModule('../../middleware/authMiddleware.js', () => ({
  protectAdmin: jest.fn(),
}));

let albumController, albumRoutes, app, authMiddleware;
beforeAll(async () => {
  albumController = await import('../../controllers/albumController.js');
  authMiddleware = await import('../../middleware/authMiddleware.js');
  albumRoutes = (await import('../album.js')).default;
  app = express();
  app.use(express.json());
  app.use('/', albumRoutes);
});

describe('Album Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: allow all admin routes
    authMiddleware.protectAdmin.mockImplementation((req, res, next) => {
      if (req.headers.authorization === 'Bearer valid-token') {
        return next();
      } else if (req.headers.authorization === 'Bearer invalid-token') {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        res.status(401).json({ message: 'Not authorized' });
      }
    });
  });

  describe('GET /', () => {
    it('should fetch approved album media', async () => {
      const now = new Date().toISOString();
      const mockMedia = [
        { filename: 'test.jpg', approved: true, timestamp: now },
        { filename: 'test2.jpg', approved: true, timestamp: now },
      ];
      albumController.getAlbumMedia.mockImplementation((req, res) =>
        res.status(200).json(mockMedia)
      );

      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockMedia);
    });

    it('should handle server errors when fetching media', async () => {
      albumController.getAlbumMedia.mockImplementation((req, res) =>
        res.status(500).json({ message: 'Server error fetching media.' })
      );

      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual('Server error fetching media.');
    });
  });

  describe('POST /upload', () => {
    it('should upload media successfully', async () => {
      albumController.uploadMedia.mockImplementation((req, res) =>
        res.status(201).json({
          message: 'All files uploaded successfully and are pending review.',
          files: [{ filename: 'uploaded.jpg' }],
        })
      );

      const res = await request(app)
        .post('/upload')
        .attach('media', Buffer.from('fake image data'), 'test.jpg');

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toContain('uploaded successfully');
    });

    it('should handle no files uploaded', async () => {
      albumController.uploadMedia.mockImplementation((req, res) =>
        res.status(400).json({ message: 'Please upload one or more files.' })
      );

      const res = await request(app).post('/upload');
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Please upload');
    });

    it('should handle file processing errors', async () => {
      albumController.uploadMedia.mockImplementation((req, res) =>
        res.status(207).json({
          message: 'Some files were processed with errors.',
          uploadedFiles: [],
          errors: [{ originalname: 'corrupt.jpg', message: 'File processing failed' }],
        })
      );

      const res = await request(app)
        .post('/upload')
        .attach('media', Buffer.from('corrupt data'), 'corrupt.jpg');

      expect(res.statusCode).toEqual(207);
      expect(res.body.errors).toHaveLength(1);
    });
  });

  describe('GET /all (Admin)', () => {
    it('should fetch all media for admin with valid token', async () => {
      const mockMedia = [
        { filename: 'test.jpg', approved: false },
        { filename: 'test2.jpg', approved: true },
      ];
      albumController.getAllAlbumMedia.mockImplementation((req, res) =>
        res.status(200).json(mockMedia)
      );

      const res = await request(app).get('/all').set('Authorization', 'Bearer valid-token');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockMedia);
    });

    it('should reject unauthorized requests', async () => {
      const res = await request(app).get('/all');
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Not authorized');
    });

    it('should reject invalid tokens', async () => {
      const res = await request(app).get('/all').set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('POST /moderate (Admin)', () => {
    it('should approve media with valid token', async () => {
      albumController.moderateMedia.mockImplementation((req, res) =>
        res.status(200).json({ message: 'Media has been approved.' })
      );

      const res = await request(app)
        .post('/moderate')
        .set('Authorization', 'Bearer valid-token')
        .send({ photoId: '507f1f77bcf86cd799439011', isApproved: true });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain('approved');
    });

    it('should reject media with valid token', async () => {
      albumController.moderateMedia.mockImplementation((req, res) =>
        res.status(200).json({ message: 'Media has been rejected and deleted.' })
      );

      const res = await request(app)
        .post('/moderate')
        .set('Authorization', 'Bearer valid-token')
        .send({ photoId: '507f1f77bcf86cd799439011', isApproved: false });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain('rejected');
    });

    it('should handle photo not found', async () => {
      albumController.moderateMedia.mockImplementation((req, res) =>
        res.status(404).json({ message: 'Photo not found.' })
      );

      const res = await request(app)
        .post('/moderate')
        .set('Authorization', 'Bearer valid-token')
        .send({ photoId: '507f1f77bcf86cd799439999', isApproved: true });

      expect(res.statusCode).toEqual(404);
    });

    it('should reject unauthorized moderation requests', async () => {
      const res = await request(app)
        .post('/moderate')
        .send({ photoId: '507f1f77bcf86cd799439011', isApproved: true });

      expect(res.statusCode).toEqual(401);
    });
  });
});
