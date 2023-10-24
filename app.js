const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const connectDB = require('./db/connect');
// Middlewares
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
// Routes
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const authMiddleware = require('./middleware/authentication');

require('dotenv').config();
require('express-async-errors');

// Environment Variables
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

const app = express();
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(xss());

// Routes
app.use('/api/v1/auth', authRouter);
// Making the route protected by adding middleware
app.use('/api/v1/jobs', authMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Starting Server
const startServer = async () => {
  try {
    await connectDB(uri);
    await app.listen(port, () =>
      console.log(`Server is listening on port ${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
