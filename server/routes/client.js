import express from 'express';

const client = express.Router();

const root = 'UI/views/';

client.get('/', (req, res) => res.sendFile('/index.html', { root }));
client.get('/dashboard', (req, res) => res.sendFile('/user/dashboard.html', { root }));
client.get('/new', (req, res) => res.sendFile('/user/new.html', { root }));
client.get('/view', (req, res) => res.sendFile('/user/view.html', { root }));
client.get('/edit', (req, res) => res.sendFile('/user/edit.html', { root }));
client.get('/admin', (req, res) => res.sendFile('/admin/dashboard.html', { root }));
client.get('/admin/view', (req, res) => res.sendFile('/admin/view.html', { root }));
client.get('/logout', (req, res) => res.sendFile('/logout.html', { root }));

client.all('*', (req, res) => res.status(404).sendFile('/404.html', { root }));

export default client;
