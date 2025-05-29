import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import {
  getAdminProductById,
  updateAdminProduct,
  type AdminProduct,
  getAllCategories, // To fetch categories for the form
  type AdminCategory
} from '../services/AdminProductApiService';

const EditProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) {
        setError('Product ID is missing.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const fetchedProduct = await getAdminProductById(productId);
        const fetchedCategories = await getAllCategories();
        setProduct(fetchedProduct);
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Failed to fetch product or categories for edit:', err);
        setError('Failed to load product data. Please try again.');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [productId]);

  const handleSubmit = async (productData: Partial<AdminProduct>) => {
    if (!productId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await updateAdminProduct(productId, productData);
      alert('Product updated successfully!');
      navigate('/admin/products'); // Redirect to product list
    } catch (err) {
      console.error('Failed to update product:', err);
      setError('Failed to update product. Please check the details and try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading product details...</div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div>
      <h1>Edit Product: {product.name}</h1>
      <ProductForm
        initialProduct={product}
        categories={categories}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Update Product"
      />
    </div>
  );
};

export default EditProductPage;