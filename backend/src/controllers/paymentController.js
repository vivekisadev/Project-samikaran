import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { supabase } from '../config/supabase.js';

dotenv.config();

let razorpayInstance;

const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys are missing in .env');
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

// @desc    Create a new order & initial donation record
// @route   POST /api/payment/order
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { amount, name, email, contact } = req.body;

    if (!amount || !name || !email || !contact) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);

    // Save pending donation securely to database
    const { error: dbError } = await supabase.from('donations').insert([{
      razorpay_order_id: order.id,
      name,
      email,
      contact,
      amount
    }]);

    if (dbError) {
      console.error('Database Error:', dbError);
      return res.status(500).json({ success: false, message: 'Database Error. Please ensure donations table exists.' });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
  }
};

// @desc    Get Razorpay Key ID
// @route   GET /api/payment/key
// @access  Public
export const getRazorpayKey = async (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};

// @desc    Verify payment signature
// @route   POST /api/payment/verify
// @access  Public
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified legally by Razorpay via signature
      // Now securely mark it successful in our database so it cannot be spoofed later!
      const { error: updateError } = await supabase.from('donations')
        .update({ status: 'Successful', razorpay_payment_id })
        .eq('razorpay_order_id', razorpay_order_id);

      if (updateError) {
        console.error('Error updating donation record:', updateError);
        // We still respond OK because user DID pay, our DB just failed to update.
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
      });
    } else {
      // If signature is invalid, mark as spoofed/failed just in case.
      await supabase.from('donations')
        .update({ status: 'Failed' })
        .eq('razorpay_order_id', razorpay_order_id);

      res.status(400).json({
        success: false,
        message: 'Invalid signature',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
