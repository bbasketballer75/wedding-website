import asyncHandler from '../utils/asyncHandler.js';

/**
 * Protects routes by checking for a secret key in the Authorization header.
 * The key should be sent as 'Bearer <your-secret-key>'.
 */
const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token && token === process.env.ADMIN_SECRET_KEY) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized, token failed or is missing.');
  }
});

export { protectAdmin };
