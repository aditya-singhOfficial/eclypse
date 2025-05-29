// controllers/productController.js
import * as prodSvc from '../services/productService.js';

export const addProduct = async (req, res, next) => {
    try {
        const product = await prodSvc.createProduct(req.body, req.files, req.user.id);
        res.status(201).json({ product });
    } catch (err) {
        next(err);
    }
};

export const getProducts = async (_, res, next) => {
    try {
        const products = await prodSvc.fetchProducts();
        res.json({ products });
    } catch (err) {
        next(err);
    }
};

export const getProductsAdmin = async (_, res, next) => {
    try {
        const products = await prodSvc.fetchProducts();
        res.json({ products });
    } catch (err) {
        next(err);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const product = await prodSvc.fetchProductById(req.params.id || req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ product });
    } catch (err) {
        next(err);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const product = await prodSvc.modifyProduct(req.params.id || req.params.productId, req.body, req.files);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ product });
    } catch (err) {
        next(err);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const result = await prodSvc.removeProduct(req.params.id || req.params.productId);
        if (!result) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        next(err);
    }
};
