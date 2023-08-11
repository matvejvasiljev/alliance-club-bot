// documentation: https://www.npmjs.com/package/express-rate-limit
const rateLimit = require('express-rate-limit');
// Limit each IP to 100 requests per `window` (here, per 1 minute)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
});

module.exports = limiter;
