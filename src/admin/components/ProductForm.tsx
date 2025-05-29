import React, { useState, useEffect, type FormEvent } from 'react';
import { type AdminProduct, type AdminCategory } from '../services/AdminProductApiService'; // Assuming AdminCategory is also exported

interface ProductFormProps {
  initialProduct?: AdminProduct; // For editing
  categories: AdminCategory[]; // To populate category dropdown
  onSubmit: (productData: Omit<AdminProduct, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;

  isSubmitting: boolean;
  submitButtonText?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  categories,
  onSubmit,
  isSubmitting,
  submitButtonText = 'Submit'
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [category, setCategory] = useState(''); // Store category ID
  const [stock, setStock] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  // Add other product fields as needed, e.g., SKU, brand

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setDescription(initialProduct.description);
      setPrice(initialProduct.price);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCategory(typeof initialProduct.category === 'string' ? initialProduct.category : (initialProduct.category as any)?._id || ''); // Handle if category is object or string ID
      setStock(initialProduct.stock);
      setImageUrl(initialProduct.imageUrl || '');
    }
  }, [initialProduct]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (price === '' || stock === '') {
      alert('Price and Stock cannot be empty.');
      return;
    }
    const productData = {
      name,
      description,
      price: Number(price),
      category, // Send category ID
      stock: Number(stock),
      imageUrl: imageUrl || undefined, // Send undefined if empty to potentially clear it
    };
    await onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Product Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
          min="0"
          step="0.01"
          required
        />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>Select a category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="stock">Stock Quantity:</label>
        <input
          type="number"
          id="stock"
          value={stock}
          onChange={(e) => setStock(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
          min="0"
          required
        />
      </div>
      <div>
        <label htmlFor="imageUrl">Image URL (optional):</label>
        <input
          type="url"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>
      {/* Add more fields here as needed */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : submitButtonText}
      </button>
    </form>
  );
};

export default ProductForm;