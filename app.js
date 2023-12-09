const fs = require('fs');
const express = require('express');
const app = express();
//We use app.use() to have access to middleware
app.use(express.json()); //middleware
const port = 3000;
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    results: tours.length,
    status: 'success',
    data: {
      tours,
    },
  });
});
app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
