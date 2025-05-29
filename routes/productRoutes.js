// routes/productRoutes.js
import express from 'express';
import {
    addProduct,
    deleteProduct,
    getProductById,
    getProducts,
    getProductsAdmin,
    updateProduct
} from '../controllers/productController.js';
import {authorize, protect} from '../middlewares/auth.js';
import {upload} from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes for product management
router.get('/admin', protect, authorize('admin'), getProductsAdmin);
router.post('/', protect, authorize('admin'), upload, addProduct);
router.put('/:productId', protect, authorize('admin'), upload, updateProduct);
router.delete('/:productId', protect, authorize('admin'), deleteProduct);

export default router;
