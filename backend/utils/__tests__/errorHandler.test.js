import { jest } from '@jest/globals';
import { errorHandler } from '../errorHandler.js';

describe('errorHandler', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      statusCode: 200,
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.NODE_ENV;
  });

  it('sets status code and returns error message', () => {
    const err = new Error('Test error');
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Test error' }));
  });

  it('should use 500 status code when res.statusCode is 200', () => {
    const error = new Error('Test error');
    res.statusCode = 200;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Test error',
      stack: expect.any(String),
    });
  });

  it('should use existing status code when res.statusCode is not 200', () => {
    const error = new Error('Test error');
    res.statusCode = 404;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Test error',
      stack: expect.any(String),
    });
  });

  it('should hide stack trace in production', () => {
    process.env.NODE_ENV = 'production';
    const error = new Error('Test error');
    res.statusCode = 500;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Test error',
      stack: '🥞',
    });
  });

  it('should show stack trace in development', () => {
    process.env.NODE_ENV = 'development';
    const error = new Error('Test error');
    error.stack = 'Error: Test error\n    at test (test.js:1:1)';
    res.statusCode = 500;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Test error',
      stack: 'Error: Test error\n    at test (test.js:1:1)',
    });
  });

  it('should handle errors without NODE_ENV set', () => {
    const error = new Error('Test error');
    error.stack = 'Error: Test error\n    at test (test.js:1:1)';
    res.statusCode = 500;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Test error',
      stack: 'Error: Test error\n    at test (test.js:1:1)',
    });
  });
});
