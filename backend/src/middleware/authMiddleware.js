import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  // DEVELOPMENT BYPASS - Allows admin access without logging in
  req.user = { role: 'admin', id: 'bypass-id' };
  next();
};

export const verifyAdmin = (req, res, next) => {
  // DEVELOPMENT BYPASS
  req.user = { role: 'admin', id: 'bypass-id' };
  next();
};
