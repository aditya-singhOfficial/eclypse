import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import {
  createAdminProduct,
  type AdminProduct,
  getAllCategories, // To fetch categories for the form
  type AdminCategory
} from '../services/AdminProductApiService';

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Failed to fetch categories for AddProductPage:', err);
        setError('Could not load categories. Please try again.');
        // Optionally, prevent form rendering or show a specific message
      }
      setIsLoadingCategories(false);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (productData: Omit<AdminProduct, '_id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createAdminProduct(productData);
      alert('Product created successfully!');
      navigate('/admin/products'); // Redirect to product list
    } catch (err) {
      console.error('Failed to create product:', err);
      setError('Failed to create product. Please check the details and try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoadingCategories) {
    return <div>Loading category data...</div>;
  }

  return (
    <div>
      <h1>Add New Product</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ProductForm
        categories={categories}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Create Product"
      />
    </div>
  );
};

export default AddProductPage;