import "dotenv/config";
import express from "express";
import cors from "cors";
import {mongooseConnection} from "./config/mongoose.js";
import authRoutes from "./routes/Authentication.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

await mongooseConnection();

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the API",
        version: "1.0.0",
        documentation: "https://example.com/docs"
    });
});

app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);


app.use((req, res) => {
    res.status(404).json({
        message: "Not Found",
        status: 404
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
