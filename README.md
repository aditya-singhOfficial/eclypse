# MERN E-Commerce Backend

A full-featured e-commerce backend built with the MERN stack (MongoDB, Express, React, Node).
Features include:

* **User authentication** (JWT, role-based: user/admin)
* **Product management** (CRUD + Cloudinary image uploads)
* **Category management**
* **Shopping cart**
* **Order processing**
* **Product reviews**
* **Centralized error handling**
* **Swagger UI**–powered API documentation

---

## 📂 Project Structure

```
backend/
├── config/
│   ├── mongoose.js           # MongoDB connection
│   └── cloudinary.js         # Cloudinary SDK setup
│
├── docs/
│   └── openapi.yaml          # OpenAPI 3.0 spec for Swagger UI
│
├── middlewares/
│   ├── auth.js               # JWT auth + role-based guards
│   ├── upload.js             # Multer disk storage for images
│   └── errorHandler.js       # Centralized error middleware
│
├── models/
│   ├── User.js
│   ├── Category.js
│   ├── Product.js
│   ├── Cart.js
│   ├── Order.js
│   └── Review.js
│
├── services/
│   ├── authService.js
│   ├── userService.js
│   ├── categoryService.js
│   ├── productService.js
│   ├── cartService.js
│   ├── orderService.js
│   └── reviewService.js
│
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── categoryController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── reviewController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── reviewRoutes.js
│
└── server.js                 # Express app bootstrap + Swagger UI
```

---

## ⚙️ Setup & Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-org/mern-ecommerce-backend.git
   cd mern-ecommerce-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file** in project root with:

   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_here

   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...

   SENDGRID_API_KEY=...
   EMAIL_FROM=you@example.com
   ```

4. **Ensure the `docs/openapi.yaml`** file is present (API spec for Swagger UI).

5. **Run in development**

   ```bash
   npm run dev
   ```

   This will start the server (with nodemon if configured) at `http://localhost:3000`.

---

## 🚀 Available Scripts

* `npm run dev`
  Runs the app in development with live reload.
* `npm test`
  (If tests are configured in the future.)

---

## 📖 API Documentation

Once the server is running, view interactive docs at:

```
http://localhost:3000/docs
```

This uses **Swagger UI** and your OpenAPI 3.0 spec (`docs/openapi.yaml`).

---

## 🔧 Environment Variables

| Name                    | Description                                   |
|-------------------------|-----------------------------------------------|
| `PORT`                  | HTTP port (default: 3000)                     |
| `MONGO_URI`             | MongoDB connection string                     |
| `JWT_SECRET`            | Secret for signing JWTs                       |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name                    |
| `CLOUDINARY_API_KEY`    | Your Cloudinary API key                       |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret                    |
| `SENDGRID_API_KEY`      | (Optional) SendGrid API key for email sending |
| `EMAIL_FROM`            | (Optional) Default sender email address       |

---

## 🛠️ Technologies & Libraries

* **Node.js** + **Express**
* **MongoDB** + **Mongoose**
* **Cloudinary** for image hosting
* **Multer** for file uploads
* **JWT** for authentication
* **bcryptjs** for password hashing
* **express-validator** for request validation (optional)
* **@sendgrid/mail** for email notifications (optional)
* **swagger-ui-express** + **yamljs** for API docs

---

## 🎯 Next Steps / TODO

* Dockerize with Docker & Docker Compose
* CI/CD pipeline (GitHub Actions)
* Frontend integration (React/Next.js)
* Payment gateway integration (Stripe, PayPal)
* Webhooks (e.g. for payments, Cloudinary)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Feel free to fork and contribute via pull requests!
