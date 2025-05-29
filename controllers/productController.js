// controllers/productController.js
import * as prodSvc from '../services/productService.js';

export const addProduct = async (req, res, next) => {
    try {
        res.status(201).json(await prodSvc.createProduct(req.body, req.files, req.user.id));
    } catch (err) {
        next(err);
    }
};

export const getProducts = async (_, res, next) => {
    try {
        res.json(await prodSvc.fetchProducts());
    } catch (err) {
        next(err);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        res.json(await prodSvc.fetchProductById(req.params.id));
    } catch (err) {
        next(err);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        res.json(await prodSvc.modifyProduct(req.params.id, req.body, req.files));
    } catch (err) {
        next(err);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        await prodSvc.removeProduct(req.params.id);
        res.json({});
    } catch (err) {
        next(err);
    }
};
