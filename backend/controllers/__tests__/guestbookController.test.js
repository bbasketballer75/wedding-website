import { jest } from '@jest/globals';
import { getGuestbookEntries, createGuestbookEntry } from '../guestbookController.js';
import GuestbookEntry from '../../models/GuestbookEntry.firestore.js';

let mockReq, mockRes;

beforeEach(() => {
  mockReq = {
    body: {},
  };
  mockRes = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  };
  GuestbookEntry.findAll = jest.fn();
  jest.clearAllMocks();
});

describe('getGuestbookEntries', () => {
  it('should fetch all guestbook entries successfully', async () => {
    const mockEntries = [
      { name: 'John Doe', message: 'Great wedding!', timestamp: new Date() },
      { name: 'Jane Smith', message: 'Beautiful ceremony', timestamp: new Date() },
    ];

    GuestbookEntry.findAll.mockResolvedValue(mockEntries);
    await getGuestbookEntries(mockReq, mockRes);
    expect(GuestbookEntry.findAll).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith(mockEntries);
  });

  it('should handle database errors', async () => {
    GuestbookEntry.findAll.mockRejectedValue(new Error('Database error'));
    await expect(getGuestbookEntries(mockReq, mockRes)).rejects.toThrow('Database error');
  });
});

describe('createGuestbookEntry', () => {
  it('should create a new guestbook entry successfully', async () => {
    const entryData = { name: 'John Doe', message: 'Great wedding!' };
    const mockEntry = {
      name: entryData.name,
      message: entryData.message,
      id: '507f1f77bcf86cd799439011',
      timestamp: new Date(),
    };
    const saveSpy = jest.spyOn(GuestbookEntry.prototype, 'save').mockResolvedValue(mockEntry);
    mockReq.body = entryData;

    await createGuestbookEntry(mockReq, mockRes);

    expect(saveSpy).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
    const jsonCall = mockRes.json.mock.calls[0][0];
    expect(jsonCall.name).toBe(entryData.name);
    expect(jsonCall.message).toBe(entryData.message);
  });

  it('should create entry with anonymous name when name is missing', async () => {
    const entryData = { message: 'Great wedding!' };
    const expectedData = { name: 'Anonymous', message: 'Great wedding!' };
    const mockEntry = {
      name: expectedData.name,
      message: expectedData.message,
      id: '507f1f77bcf86cd799439011',
      timestamp: new Date(),
    };

    mockReq.body = entryData;
    const saveSpy = jest.spyOn(GuestbookEntry.prototype, 'save').mockResolvedValue(mockEntry);

    await createGuestbookEntry(mockReq, mockRes);

    expect(saveSpy).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
    const jsonCall = mockRes.json.mock.calls[0][0];
    expect(jsonCall.name).toBe(expectedData.name);
    expect(jsonCall.message).toBe(expectedData.message);
  });

  it('should reject empty message', async () => {
    mockReq.body = { name: 'John Doe', message: '' };

    // Mock the error throwing by setting up next function
    const mockNext = jest.fn();

    try {
      await createGuestbookEntry(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(error.message).toEqual('A message is required to sign the guestbook.');
    }

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it('should reject whitespace-only message', async () => {
    mockReq.body = { name: 'John Doe', message: '   ' };

    const mockNext = jest.fn();

    try {
      await createGuestbookEntry(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(error.message).toEqual('A message is required to sign the guestbook.');
    }

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it('should handle database creation errors', async () => {
    mockReq.body = { name: 'John Doe', message: 'Great wedding!' };

    jest.spyOn(GuestbookEntry.prototype, 'save').mockRejectedValue(new Error('Database error'));

    const mockNext = jest.fn();

    try {
      await createGuestbookEntry(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(error.message).toEqual('Database error');
    }

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should handle validation errors', async () => {
    mockReq.body = { name: 'John Doe', message: 'x'.repeat(501) }; // Exceeds maxlength
    const validationError = new Error('Validation failed');
    validationError.name = 'ValidationError';

    jest.spyOn(GuestbookEntry.prototype, 'save').mockRejectedValue(validationError);

    const mockNext = jest.fn();

    try {
      await createGuestbookEntry(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(error.name).toEqual('ValidationError');
    }

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});
