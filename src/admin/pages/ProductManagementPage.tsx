import React, { useEffect, useState, useCallback } from 'react';
import {
  getAllAdminProducts,
  deleteAdminProduct,
 type AdminProduct,
  // getAllCategories, // Uncomment if you implement category filtering/selection
  // AdminCategory
} from '../services/AdminProductApiService';
import { Link } from 'react-router-dom'; // For Add/Edit product page navigation

const ProductManagementPage: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  // const [categories, setCategories] = useState<AdminCategory[]>([]); // For category dropdown
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductsAndCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProducts = await getAllAdminProducts();
      setProducts(fetchedProducts);
      // const fetchedCategories = await getAllCategories(); // Fetch categories for dropdowns
      // setCategories(fetchedCategories);
    } catch (err) {
      console.error('Failed to fetch products or categories:', err);
      setError('Failed to load data. Please try again.');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProductsAndCategories();
  }, [fetchProductsAndCategories]);

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteAdminProduct(productId);
        setProducts(products.filter(product => product._id !== productId));
        alert('Product deleted successfully.');
      } catch (err) {
        console.error('Failed to delete product:', err);
        alert('Failed to delete product.');
      }
    }
  };

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>Product Management</h1>
      <Link to="/admin/products/new" style={{ marginBottom: '20px', display: 'inline-block' }}>
        Add New Product
      </Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
            {/* Add other headers like Image, SKU etc. */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={6}>No products found.</td>
            </tr>
          ) : (
            products.map(product => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>{product.category}</td> {/* Adjust if category is an object */}
                <td>
                  <Link to={`/admin/products/edit/${product._id}`} style={{marginRight: '5px'}}>
                    Edit
                  </Link>
                  <button onClick={() => handleDeleteProduct(product._id)} style={{color: 'red'}}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagementPage;