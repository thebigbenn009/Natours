const express = require('express');
const app = express();
const port = 3000;
app.get('/api/v1/tours');
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
