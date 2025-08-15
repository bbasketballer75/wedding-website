import express from 'express';
import { getLocations, logVisit } from '../controllers/mapController.js';

const router = express.Router();

router.route('/locations').get(getLocations);
import rateLimit from 'express-rate-limit';

// Rate limiter: max 10 map logs per IP per day
const mapLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10,
  message: 'Too many map log attempts from this IP, please try again tomorrow.',
});

router.route('/log-visit').post(mapLimiter, logVisit);

export default router;
