import { supabase } from '../config/supabase.js';
import nodemailer from 'nodemailer';

export const submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    const fullName = `${firstName} ${lastName}`;

    // 1. Save to Database (Supabase)
    const { error: dbError } = await supabase.from('contacts').insert([{
      name: fullName,
      email,
      subject: 'Contact Form Submission',
      message: phone ? `Phone: ${phone}\n\n${message}` : message,
    }]);

    if (dbError) {
      console.error('Supabase Error:', dbError);
      return res.status(500).json({ success: false, message: 'Database Error. Please try again later.' });
    }

    // 2. Configure Email Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // 3. Email to Admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Request from ${fullName}`,
      text: `
        You have received a new message from the contact form.
        
        Name: ${fullName}
        Email: ${email}
        Phone: ${phone}
        
        Message:
        ${message}
      `,
    };

    // 4. Email to User (Auto-reply)
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Samikaran',
      text: `
        Dear ${firstName},
        
        Thank you for reaching out to Samikaran. We have received your message and will get back to you shortly.
        
        Best Regards,
        Team Samikaran
      `,
    };

    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);
        console.log('Emails sent successfully');
      } else {
        console.log('Skipping email sending: Missing EMAIL_USER or EMAIL_PASS in .env');
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({ success: true, message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Contact Form Error:', error);
    res.status(500).json({ success: false, message: 'Server Error. Please try again later.' });
  }
};
