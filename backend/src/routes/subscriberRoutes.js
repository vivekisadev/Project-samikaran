import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { listSubscribers, subscribe, deleteSubscriber } from '../controllers/subscriberController.js';

const router = express.Router();

router.get('/', requireAuth, listSubscribers);
router.post('/', subscribe);
router.delete('/:id', requireAuth, deleteSubscriber);

export default router;
