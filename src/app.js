const express = require('express');
const mongoDB = require('./config/mongoDB');
const routes = require('./routes');
const errorHandler = require('./exceptions/ErrorHandler');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
require('dotenv').config();
const {
  apiRateLimiter,
  loginRateLimiter,
} = require('./middlewares/rateLimiters');

mongoDB.connectDB();
mongoDB.createUserRoles();
mongoDB.createCategories();
mongoDB.initializeSubcategories();

app.use(morgan('dev'));
app.use(cors());
app.use(hpp());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send(`API Running!`));

app.use(apiRateLimiter);

app.use(routes);

// Handle not found
app.use((req, res, next) => {
  res.status(404).send('404 Not Found');
});

// Global Error handler
app.use(errorHandler);

module.exports = app;
