// routes/productRoutes.js
import express from 'express';
import {
    addProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct
} from '../controllers/productController.js';
import {authorize, protect} from '../middlewares/auth.js';
import {upload} from '../middlewares/upload.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', protect, authorize('admin'), upload, addProduct);
router.put('/:id', protect, authorize('admin'), upload, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
