const express = require('express');
const app = express();
const path = require("path");
const cors = require("cors");
const uploadRoute = require("./routes/uploadRoute");
const routes = require('./routes/routes');

app.use(cors());
app.use(express.json());
app.use('/', routes);
app.use('/uploads', express.static('uploads'));
app.use("/", uploadRoute);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
