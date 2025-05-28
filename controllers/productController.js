import {
    createProduct,
    fetchProducts,
    fetchProductById,
    modifyProduct,
    removeProduct
} from '../services/productService.js';

export async function addProduct(req, res) {
    try {
        const product = await createProduct(req.body, req.files, req.user.id);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getProducts(req, res) {
    try {
        const products = await fetchProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getProductById(req, res) {
    try {
        const product = await fetchProductById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Not Found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function updateProduct(req, res) {
    try {
        const product = await modifyProduct(
            req.params.id,
            req.body,
            req.files,
            req.user.id
        );
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function deleteProduct(req, res) {
    try {
        await removeProduct(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
