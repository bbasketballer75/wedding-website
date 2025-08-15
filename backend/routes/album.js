import express from 'express';
import {
  uploadMedia,
  getAlbumMedia,
  getAllAlbumMedia as getAllMedia,
  moderateMedia,
} from '../controllers/albumController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get approved media
router.get('/', getAlbumMedia);

// Public route to upload media. The 'media' field name must match the frontend form.
router.post('/upload', upload.array('media', 10), uploadMedia); // Allow up to 10 files

// Admin routes
router.get('/all', protectAdmin, getAllMedia);
router.post('/moderate', protectAdmin, moderateMedia);

export default router;
