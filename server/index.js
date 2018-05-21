import express from 'express';
import bodyParser from 'body-parser';
import api1 from './routes/api1';

const app = express();

const port = (process.env.PORT || 3000);

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
