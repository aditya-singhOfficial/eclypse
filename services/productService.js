// services/productService.js
import cloudinary from '../config/cloudinary.js';
import fs from 'fs/promises';
import Product from '../models/Product.js';

async function uploadAndCleanup(filePath) {
    try {
        const res = await cloudinary.uploader.upload(filePath, {folder: 'products'});
        await fs.unlink(filePath);
        return res;
    } catch (err) {
        await fs.unlink(filePath).catch(() => {
        });
        throw err;
    }
}

export const fetchProducts = () => Product.find().populate('category').populate('createdBy', 'name');
export const fetchProductById = id => Product.findById(id).populate('category').populate('createdBy', 'name');

export async function createProduct(data, files, userId) {
    const uploads = await Promise.all(files.map(f => uploadAndCleanup(f.path)));
    const images = uploads.map(r => ({url: r.secure_url, public_id: r.public_id}));
    return Product.create({...data, images, createdBy: userId});
}

export async function modifyProduct(id, data, files = []) {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');

    if (files.length) {
        // delete old images
        await Promise.all(product.images.map(img => cloudinary.uploader.destroy(img.public_id)));
        const uploads = await Promise.all(files.map(f => uploadAndCleanup(f.path)));
        product.images = uploads.map(r => ({url: r.secure_url, public_id: r.public_id}));
    }

    Object.assign(product, data);
    return product.save();
}

export async function removeProduct(id) {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');
    await Promise.all(product.images.map(img => cloudinary.uploader.destroy(img.public_id)));
    return product.deleteOne();
}
