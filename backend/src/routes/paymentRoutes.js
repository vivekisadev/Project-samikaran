import express from 'express';
import { createOrder, verifyPayment, getRazorpayKey } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/order', createOrder);
router.post('/verify', verifyPayment);
router.get('/key', getRazorpayKey);

export default router;
