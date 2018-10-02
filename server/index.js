import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import swagger from 'swagger-ui-express';
import swaggerDocument from '../api-docs/swagger.json';
import api1 from './routes/api1';
import client from './routes/client';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  optionsSuccessStatus: 200,
  allowedHeaders: 'Origin, x-access-token, content-type, Authorization',
}));

// use morgan for logging in dev mode
if (process.env.NODE_ENV === 'dev') {
  const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
  app.use(morgan('combined', { stream: accessLogStream }));
}

// use bodyParser to get json and form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files
app.use('/static', express.static(path.join(__dirname, '../UI/assets/')));

// handle calls to API routes
app.use('/api/v1', api1);

// serve Swagger API docs
app.use('/docs', swagger.serve, swagger.setup(swaggerDocument));

// serve client
app.use('/', client);

// handle calls to undefined routes
app.all('*', (req, res) => {
  res.status(404).json({ error: 'The resource you\'re looking for is not available' });
});


// start the server
const port = (process.env.PORT || 3000);
if (!module.parent) {
  app.listen(port, () => { console.log(`Server running on port ${port}...`); });
}

// export app for testing
export default app;
