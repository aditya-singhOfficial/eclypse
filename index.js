import "dotenv/config";
import express from "express"
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the API",
        version: "1.0.0",
        documentation: "https://example.com/docs"
    })
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});