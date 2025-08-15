import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import winston from 'winston';
import xss from 'xss';
import { CORS_ORIGINS, PORTS } from '../config/ports.js';
import specs from './config/swagger.js';

// Import enhanced services
import performanceManager from './services/performanceManager.js';

// Import routes
import activityRoutes from './routes/activityRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import albumRoutes from './routes/album.js';
import analyticsRoutes from './routes/analytics.js';
import guestbookRoutes from './routes/guestbookRoutes.js';
import guestMemoriesRoutes from './routes/guestMemories.js';
import healthRoutes from './routes/healthRoutes.js';
import mapRoutes from './routes/mapRoutes.js';
import photoTagsRoutes from './routes/photoTags.js';
import reactionRoutes from './routes/reactionRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import visitorsRoutes from './routes/visitors.js';

// Import new enhancement routes
import anniversaryRoutes from './routes/anniversaryRoutes.js';
import familyLegacyRoutes from './routes/familyLegacyRoutes.js';
import guestConnectionRoutes from './routes/guestConnectionRoutes.js';
import guestStoriesRoutes from './routes/guestStoriesRoutes.js';
import memoryVaultRoutes from './routes/memoryVaultRoutes.js';
import reunionRoutes from './routes/reunionRoutes.js';
import timeCapsuleRoutes from './routes/timeCapsuleRoutes.js';

import { errorHandler } from './utils/errorHandler.js';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enhanced compression with smart configuration
app.use(performanceManager.createCompressionMiddleware());

// Performance monitoring middleware
app.use(performanceManager.createPerformanceMiddleware());

// Response time monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
    };

    // Log slow requests (>1000ms) as warnings
    if (duration > 1000) {
      logger.warn('Slow request detected', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
});

// Centralized logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
  transports: [new winston.transports.Console()],
});

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        mediaSrc: ["'self'"],
        connectSrc: [
          "'self'",
          `http://localhost:${PORTS.BACKEND}`,
          `http://localhost:${PORTS.FRONTEND}`,
          'https://api.ip-api.com',
          'https://maps.googleapis.com',
        ],
      },
    },
  })
);

// Middleware
const corsOptions = {
  origin: CORS_ORIGINS,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      try {
        // Sanitize all incoming JSON safely
        const rawBody = buf.toString();
        // Only process if it's valid JSON
        const parsed = JSON.parse(rawBody);
        req.body = JSON.parse(xss(JSON.stringify(parsed)));
      } catch (jsonError) {
        // Log the error and let express handle invalid JSON
        logger.warn('JSON parsing error during sanitization:', jsonError.message);
        // Don't modify req.body, let express handle the error naturally
      }
    },
  })
);
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Trust the first proxy hop (important for getting the correct IP in production on services like Cloud Run)
app.set('trust proxy', 1);

// The project root is one level up from the 'backend' directory
const rootDir = path.join(__dirname, '..');
// Serve static assets with long cache headers
const oneYear = 1000 * 60 * 60 * 24 * 365;
app.use(
  '/uploads',
  express.static(path.join(rootDir, 'uploads'), {
    maxAge: oneYear,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    },
  })
);
app.use(
  '/public',
  express.static(path.join(rootDir, 'public'), {
    maxAge: oneYear,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    },
  })
);

// API Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Wedding Site API Documentation',
  })
);

// Mount routers
app.use('/api/health', healthRoutes);
app.use('/api/guestbook', guestbookRoutes);
app.use('/api/album', albumRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/visitors', visitorsRoutes);
app.use('/api/photos', photoTagsRoutes);
app.use('/api/memories', guestMemoriesRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reactions', reactionRoutes);

// Mount API routes
app.use('/api/anniversaries', anniversaryRoutes);
app.use('/api/guest-stories', guestStoriesRoutes);
app.use('/api/time-capsules', timeCapsuleRoutes);
app.use('/api/reunions', reunionRoutes);
app.use('/api/family-legacy', familyLegacyRoutes);
app.use('/api/guest-connections', guestConnectionRoutes);
app.use('/api/memory-vault', memoryVaultRoutes);

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply the rate limiting middleware to all API requests
app.use('/api', limiter);

// Use custom error handler
app.use(errorHandler);

export default app;
