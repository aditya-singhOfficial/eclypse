// routes/categoryRoutes.js
import express from 'express';
import {
    createCategory,
    deleteCategory,
    getCategory,
    listCategories,
    updateCategory
} from '../controllers/categoryController.js';
import {authorize, protect} from '../middlewares/auth.js';

const router = express.Router();

router.get('/', listCategories);
router.get('/:id', getCategory);

router.use(protect, authorize('admin'));
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
