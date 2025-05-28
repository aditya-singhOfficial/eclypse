import { createBrowserRouter } from "react-router-dom"
import App from "./App"
import Home from "./pages/Home"
import Product from "./pages/Product"
import Products from "./pages/Products"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import ErrorPage from "./pages/ErrorPage"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "products",
                element: <Products />
            },
            {
                path: "product/:id",
                element: <Product />
            },
            {
                path: "cart",
                element: <Cart />
            },
            {
                path: "checkout",
                element: <Checkout />
            }
        ]
    }
])

export { router }