import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import swagger from 'swagger-ui-express';
import swaggerDocument from './api-docs/swagger.json';

import api1 from './routes/api1';
import client from './routes/client';

dotenv.config();

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/static', express.static(path.join(__dirname, '../UI/assets/')));
app.use('/api/v1', api1);
app.all('/api/v2*', (req, res) => {
  res.status(501).json({ message: 'We are working on creating a better experience for you' });
});
app.use('/docs', swagger.serve, swagger.setup(swaggerDocument));
app.use('/', client);
app.all('*', (req, res) => {
  res.status(404).json({ error: 'The resource you\'re looking for is not available' });
});

const port = (process.env.PORT || 3000);
app.listen(port, () => { console.log(`Server running on port ${port}...`); });

export default app;
