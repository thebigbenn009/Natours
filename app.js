const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();
//MIDDLEWARE
//We use app.use() to have access to middleware

app.use(morgan('dev'));
app.use(express.json()); //middleware
//creating our own middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
const port = 3000;
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
//ROUTE HANDLERS
const getAllTours = (req, res) => {
  res.status(200).json({
    results: tours.length,
    requestedAt: req.requestTime,
    status: 'success',
    data: {
      tours,
    },
  });
};
const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  const tour = tours.find((tour) => tour.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
const createTour = (req, res) => {
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
};

const editTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'updated tour here...',
    },
  });
};
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
};
// app.get('/api/v1/tours', getAllTours);
// app.patch('/api/v1/tours/:id', editTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);

//ROUTE

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').patch(editTour).get(getTour).delete(deleteTour);

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
