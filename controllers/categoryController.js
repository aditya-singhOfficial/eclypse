// controllers/categoryController.js
import * as categoryService from '../services/categoryService.js';

export const listCategories = async (req, res, next) => {
    try {
        res.json(await categoryService.fetchCategories());
    } catch (err) {
        next(err);
    }
};

export const getCategory = async (req, res, next) => {
    try {
        res.json(await categoryService.fetchCategoryById(req.params.id));
    } catch (err) {
        next(err);
    }
};

export const createCategory = async (req, res, next) => {
    try {
        res.status(201).json(await categoryService.createCategory(req.body));
    } catch (err) {
        next(err);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        res.json(await categoryService.updateCategory(req.params.id, req.body));
    } catch (err) {
        next(err);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        res.json({});
    } catch (err) {
        next(err);
    }
};
