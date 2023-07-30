// documentation: https://www.npmjs.com/package/express-rate-limit
const rateLimit = require('express-rate-limit');
// Limit each IP to 100 requests per `window` (here, per 10 minutes)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

module.exports = limiter;
