import express from 'express';

const userRoutes = express.Router();

const root = 'UI/views/';

userRoutes.get('/dashboard', (req, res) => res.sendFile('/user/dashboard.html', { root }));
userRoutes.get('/new', (req, res) => res.sendFile('/user/new.html', { root }));
userRoutes.get('/view', (req, res) => res.sendFile('/user/view.html', { root }));
userRoutes.get('/edit', (req, res) => res.sendFile('/user/edit.html', { root }));

export default userRoutes;
