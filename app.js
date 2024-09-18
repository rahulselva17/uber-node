// Import Express
const express = require('express');
const app = express();

// Import routes
const routes = require('./routes/routes');

// Use the routes
app.use('/', routes);

// Define a port
const PORT = 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
