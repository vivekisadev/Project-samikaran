import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import contactRoutes from './routes/contactRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://checkout.razorpay.com", "https://*.razorpay.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.cloudinary.com", "https://*.razorpay.com"],
      connectSrc: ["'self'", "https://*.razorpay.com", "https://api.razorpay.com", "https://lumberjack.razorpay.com"],
      frameSrc: ["'self'", "https://*.razorpay.com", "https://api.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { success: false, message: 'Too many requests created from this IP, please try again after 15 minutes' }
});

// Apply the rate limiting middleware to API calls only
app.use('/api', apiLimiter);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// Routes
const mountRoutes = (prefix = '') => {
  app.use(`${prefix}/contact`, contactRoutes);
  app.use(`${prefix}/payment`, paymentRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
  app.use(`${prefix}/projects`, projectRoutes);
  app.use(`${prefix}/settings`, settingsRoutes);
  app.use(`${prefix}/media`, mediaRoutes);
  app.use(`${prefix}/subscribers`, subscriberRoutes);
  app.use(`${prefix}/reports`, reportRoutes);
  app.use(`${prefix}/announcements`, announcementRoutes);
  app.use(`${prefix}/testimonials`, testimonialRoutes);
};

mountRoutes('/api');
// Mount without /api prefix just in case Vercel rewrites strip the prefix when routing to the backend service
mountRoutes('');

// Serve Frontend Static Files
if (!process.env.VERCEL) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const frontendDistPath = path.join(__dirname, '../../frontend/dist');

  app.use(express.static(frontendDistPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // On Vercel, return 404 for unmatched routes instead of throwing an error by looking for local files
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API route not found on backend service' });
  });
}

export default app;
