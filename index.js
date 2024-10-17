const express = require('express');
const cors = require('cors');
const { HandileDBconnection } = require('./connections/dbconnect');
const { routes } = require('./routes/gettotuch');
const { applicationroute } = require('./routes/applicationCandiate');

const app = express();
const PORT = 7000;
const mongoURI = 'mongodb://localhost:27017/Sailors';

// DB Connection
HandileDBconnection(mongoURI);

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Sailors API');
});

// Routes for other services
app.use('/gettotuchuser', routes);
app.use('/candidate', applicationroute);

// Starting the server
app.listen(PORT, () => console.log('Server is started on PORT:  , http:127.0.0.1:7000/files ' + PORT));
