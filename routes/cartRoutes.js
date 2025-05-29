// routes/cartRoutes.js
import express from 'express';
import {addItem, clearCart, getCart, removeItem, updateItem} from '../controllers/cartController.js';
import {protect} from '../middlewares/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', getCart);
router.post('/', addItem);
router.put('/:itemId', updateItem);
router.delete('/:itemId', removeItem);
router.delete('/', clearCart);

export default router;
