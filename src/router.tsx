import { createBrowserRouter } from "react-router-dom"
import App from "./App"
import Home from "./pages/Home"
import Product from "./pages/Product"
import Products from "./pages/Products"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import ErrorPage from "./pages/ErrorPage"
import OrderHistory from "./pages/OrderHistory"
import OrderDetails from "./pages/OrderDetails"
import OrderConfirmation from "./pages/OrderConfirmation"
import OrderTracking from "./pages/OrderTracking"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,        children: [
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
            },
            {
                path: "order-history",
                element: <OrderHistory />
            },
            {
                path: "order/:id",
                element: <OrderDetails />
            },
            {
                path: "order-confirmation/:id",
                element: <OrderConfirmation />
            },
            {
                path: "track-order",
                element: <OrderTracking />
            },
            {
                path: "track-order/:id",
                element: <OrderTracking />
            }, {
                path: "*",
                element: <ErrorPage />
            }
        ]
    }
])

export { router }