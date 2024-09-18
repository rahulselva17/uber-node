// Import Express
const express = require('express');
const router = express.Router();

// Define the home route
router.get('/', (req, res) => {
  res.send('Hello World!');
});

// Define an about route
router.get('/about', (req, res) => {
  res.send('This is the About page!');
});

// Export the router
module.exports = router;
