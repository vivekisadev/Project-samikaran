import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { login, listAdmins, createAdmin, deleteAdmin, changePassword, bootstrap } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', login);
router.post('/bootstrap', bootstrap);
router.get('/users', requireAuth, listAdmins);
router.post('/users', requireAuth, createAdmin);
router.delete('/users/:id', requireAuth, deleteAdmin);
router.patch('/users/:id/password', requireAuth, changePassword);

export default router;
