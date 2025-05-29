// services/categoryService.js
import Category from '../models/Category.js';

export const fetchCategories = () => Category.find();
export const fetchCategoryById = id => Category.findById(id);
export const createCategory = data => Category.create(data);
export const updateCategory = (id, data) => Category.findByIdAndUpdate(id, data, {new: true});
export const deleteCategory = id => Category.findByIdAndDelete(id);
