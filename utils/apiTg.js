const axios = require('axios');

const apiTg = axios.create({
  headers: {
    'Content-Type': 'image/jpeg',
  },
});

module.exports = apiTg;
