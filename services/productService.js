import cloudinary from '../config/cloudinary.js';
import fs from 'fs/promises';
import Product from '../models/Product.js';

// existing uploadAndCleanup helper…
async function uploadAndCleanup(filePath, folder = 'products') {
    try {
        const result = await cloudinary.uploader.upload(filePath, {folder});
        await fs.unlink(filePath);
        return result;
    } catch (err) {
        await fs.unlink(filePath).catch(() => {
        });
        throw err;
    }
}

export async function createProduct(data, files, userId) {
    const uploads = await Promise.all(files.map(f => uploadAndCleanup(f.path)));
    const images = uploads.map(r => ({url: r.secure_url, public_id: r.public_id}));
    return await Product.create({...data, images, createdBy: userId});
}

export async function fetchProducts() {
    return Product.find().sort({createdAt: -1});
}

export async function fetchProductById(id) {
    return Product.findById(id);
}

export async function modifyProduct(id, data, files = [], userId) {
    const product = await Product.findById(id);
    if (!product) throw new Error('Not Found');

    // 1️⃣ If new images uploaded, push them
    if (files.length) {
        const uploads = await Promise.all(files.map(f => uploadAndCleanup(f.path)));
        const newImgs = uploads.map(r => ({url: r.secure_url, public_id: r.public_id}));
        product.images.push(...newImgs);
    }

    // 2️⃣ Update other fields
    Object.assign(product, data);

    // 3️⃣ Save & return
    return product.save();
}

export async function removeProduct(id) {
    const product = await Product.findById(id);
    if (!product) throw new Error('Not Found');

    // 1️⃣ Delete all images from Cloudinary
    await Promise.all(
        product.images.map(img => cloudinary.uploader.destroy(img.public_id))
    );

    // 2️⃣ Remove product document
    await product.remove();
}
