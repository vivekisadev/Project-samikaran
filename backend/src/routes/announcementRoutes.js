import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { listAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';

const router = express.Router();

router.get('/', listAnnouncements);
router.get('/:id', getAnnouncement);
router.post('/', requireAuth, createAnnouncement);
router.put('/:id', requireAuth, updateAnnouncement);
router.delete('/:id', requireAuth, deleteAnnouncement);

export default router;
