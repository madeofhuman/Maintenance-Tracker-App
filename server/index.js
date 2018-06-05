import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

import api1 from './routes/api1';

dotenv.config();

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));

const port = (process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Maintenance Tracker API' });
});

app.use('/api/v1', api1);

app.all('/api/v2*', (req, res) => {
  res.status(501).json({ message: 'We are working on creating a better experience for you' });
});

app.all('*', (req, res) => {
  res.status(404).json({ error: 'The resource you\'re looking for is not available' });
});

app.listen(port, () => { console.log(`Running on port ${port}`); });

export default app;
