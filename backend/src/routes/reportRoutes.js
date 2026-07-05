import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { listReports, getReport, createReport, updateReport, deleteReport } from '../controllers/reportController.js';

const router = express.Router();

router.get('/', listReports);
router.get('/:id', getReport);
router.post('/', requireAuth, createReport);
router.put('/:id', requireAuth, updateReport);
router.delete('/:id', requireAuth, deleteReport);

export default router;
