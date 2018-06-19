import express from 'express';
import userRoutes from './client/userRoutes';
import adminRoutes from './client/adminRoutes';

const client = express.Router();

const root = 'UI/views/';

client.get('/', (req, res) => res.sendFile('/index.html', { root }));
client.get('/logout', (req, res) => res.sendFile('/logout.html', { root }));

client.use('/', userRoutes);
client.use('/admin', adminRoutes);

client.all('*', (req, res) => res.status(404).sendFile('/404.html', { root }));

export default client;
