import express from 'express';

const adminRoutes = express.Router();

const root = 'UI/views/';

adminRoutes.get('/', (req, res) => res.sendFile('/admin/dashboard.html', { root }));
adminRoutes.get('/view', (req, res) => res.sendFile('/admin/view.html', { root }));

export default adminRoutes;
