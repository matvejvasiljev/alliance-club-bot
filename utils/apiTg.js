const axios = require('axios');

const apiTg = axios.create({
  headers: {
    'Content-Type': 'image/png',
  },
});

module.exports = apiTg;