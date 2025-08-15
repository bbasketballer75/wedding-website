import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import videoRoutes from '../videoRoutes.js';
import * as videoController from '../../controllers/videoController.js';

const app = express();
app.use(express.json());
app.use('/', videoRoutes);

describe('Video Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (videoController.streamVideo && videoController.streamVideo.mockReset)
      videoController.streamVideo.mockReset();
  });
  it('should return 404 for any video route since streaming was removed', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(404);
  });
});
