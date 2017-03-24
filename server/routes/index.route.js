import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import entityRoutes from './entity.route';
import transactionRoutes from './transaction.route';
import uploadRoutes from './upload.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount entity routes at /entities
router.use('/entities', entityRoutes);

// mount transaction routes at /transactions
router.use('/transactions', transactionRoutes);

// mount upload routes at /uploads
router.use('/uploads', uploadRoutes);

export default router;
