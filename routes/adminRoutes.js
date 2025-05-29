// routes/adminRoutes.js
import express from 'express';
import {
    getDashboardStats,
    getTotalSales
} from '../controllers/adminController.js';
import {authorize, protect} from '../middlewares/auth.js';

const router = express.Router();

// Apply admin protection to all routes
router.use(protect, authorize('admin'));

// Analytics routes
router.get('/stats', getDashboardStats);
router.get('/stats/total-sales', getTotalSales);

export default router;
