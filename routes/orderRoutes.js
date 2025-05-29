// routes/orderRoutes.js
import express from 'express';
import {
    createOrder,
    deleteOrder,
    getOrder,
    listMyOrders,
    listOrders,
    updateOrderStatus
} from '../controllers/orderController.js';
import {authorize, protect} from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, listMyOrders);

router.use(protect, authorize('admin'));
router.get('/', listOrders);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;
