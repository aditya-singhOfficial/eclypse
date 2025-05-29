// routes/orderRoutes.js
import express from 'express';
import {
    createOrder,
    deleteOrder,
    getOrder,
    getMyOrder,
    listMyOrders,
    listOrders,
    updateOrderStatus,
    getAllOrdersAdmin,
    markOrderDelivered
} from '../controllers/orderController.js';
import {authorize, protect} from '../middlewares/auth.js';

const router = express.Router();

// User order routes
router.post('/', protect, createOrder);
router.get('/my', protect, listMyOrders);
router.get('/my/:id', protect, getMyOrder);

// Admin order routes
router.get('/admin/all', protect, authorize('admin'), getAllOrdersAdmin);
router.get('/:id', protect, authorize('admin'), getOrder);
router.put('/:orderId/status', protect, authorize('admin'), updateOrderStatus);
router.put('/:orderId/deliver', protect, authorize('admin'), markOrderDelivered);
router.delete('/:id', protect, authorize('admin'), deleteOrder);

// Legacy admin routes (for backwards compatibility)
router.get('/', protect, authorize('admin'), listOrders);

export default router;
