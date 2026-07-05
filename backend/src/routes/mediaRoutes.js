import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { listMedia, createMedia, updateMedia, deleteMedia } from '../controllers/mediaController.js';

const router = express.Router();

router.get('/', listMedia);
router.post('/', requireAuth, createMedia);
router.put('/:id', requireAuth, updateMedia);
router.delete('/:id', requireAuth, deleteMedia);

export default router;
