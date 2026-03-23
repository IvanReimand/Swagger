const axios = require('axios');

const client = axios.create({
  baseURL: 'https://petstore.swagger.io/v2',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }, 
  validateStatus: null,
});

module.exports = client;