const rateLimit = require('express-rate-limit');
const { RATE_LIMITS } = require('../config/constants');

const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: RATE_LIMITS.DEFAULT,
  message: 'Too many requests, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: RATE_LIMITS.AUTH,
  message: 'Too many auth requests, please try again later.'
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: RATE_LIMITS.AI,
  message: 'Too many AI requests, please try again later.'
});

module.exports = {
  defaultLimiter,
  authLimiter,
  aiLimiter
};