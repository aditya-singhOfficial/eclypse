// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import {mongooseConnection} from './config/mongoose.js';
import {swaggerUiServe, swaggerUiSetup} from './config/swagger.js';
import {errorHandler} from './middlewares/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

const PORT = process.env.PORT || 3000;

await mongooseConnection();

const app = express();
app.use(cors());
app.use(express.json());

// 1️⃣ Mount your API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
// nested reviews under products:
app.use('/api/products/:id/reviews', reviewRoutes);

// 2️⃣ Mount Swagger UI (after all your routes)
app.use('/docs', swaggerUiServe, swaggerUiSetup);

// 3️⃣ Centralized error handling
app.use(errorHandler);

// 4️⃣ Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📚 Swagger docs at http://localhost:${PORT}/docs`);
});
