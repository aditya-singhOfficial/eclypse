// controllers/cartController.js
import * as cartSvc from '../services/cartService.js';

export const getCart = async (req, res, next) => {
    try {
        res.json(await cartSvc.getCartByUser(req.user.id));
    } catch (err) {
        next(err);
    }
};

export const addItem = async (req, res, next) => {
    try {
        res.json(await cartSvc.addToCart(req.user.id, req.body.productId, req.body.quantity));
    } catch (err) {
        next(err);
    }
};

export const updateItem = async (req, res, next) => {
    try {
        res.json(await cartSvc.updateCartItem(req.user.id, req.params.itemId, req.body.quantity));
    } catch (err) {
        next(err);
    }
};

export const removeItem = async (req, res, next) => {
    try {
        res.json(await cartSvc.removeCartItem(req.user.id, req.params.itemId));
    } catch (err) {
        next(err);
    }
};

export const clearCart = async (req, res, next) => {
    try {
        res.json(await cartSvc.clearCart(req.user.id));
    } catch (err) {
        next(err);
    }
};
