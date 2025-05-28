import express from 'express';
import {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';
import { upload } from '../middlewares/upload.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Create
router.post(
    '/',
    protect,
    authorize('admin'),
    upload,
    addProduct
);

// Read all
router.get(
    '/',
    protect,
    getProducts
);

// Read one
router.get(
    '/:id',
    protect,
    getProductById
);

// Update
router.put(
    '/:id',
    protect,
    authorize('admin'),
    upload,            // optional: if updating images
    updateProduct
);

// Delete
router.delete(
    '/:id',
    protect,
    authorize('admin'),
    deleteProduct
);

export default router;
