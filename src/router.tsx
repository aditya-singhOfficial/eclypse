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
import Login from "./pages/Login"
import Register from "./pages/Register";
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import AdminLoginPage from "./admin/pages/AdminLoginPage";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import UserManagementPage from "./admin/pages/UserManagementPage";
import ProductManagementPage from "./admin/pages/ProductManagementPage";
import AddProductPage from "./admin/pages/AddProductPage";
import EditProductPage from "./admin/pages/EditProductPage";
import OrderManagementPage from "./admin/pages/OrderManagementPage";
import AdminOrderDetailsPage from "./admin/pages/AdminOrderDetailsPage";

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
            },            {
                path: "track-order/:id",
                element: <OrderTracking />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            }, {
                path: "*",
                element: <ErrorPage />
            }
        ]
    },
    {
        path: "/admin",
        element: <ProtectedRoute />,
        children: [
            {
                path: "", 
                element: <AdminLayout />,
                children: [
                    {
                        index: true, 
                        element: <AdminDashboardPage />
                    },
                    {
                        path: "users",
                        element: <UserManagementPage />
                    },
                    {
                        path: "products",
                        element: <ProductManagementPage />
                    },
                    {
                        path: "products/new",
                        element: <AddProductPage />
                    },
                    {
                        path: "products/edit/:productId",
                        element: <EditProductPage />
                    },
                    {
                        path: "orders",
                        element: <OrderManagementPage />
                    },
                    {
                        path: "orders/:orderId",
                        element: <AdminOrderDetailsPage />
                    }
                    // Future admin sub-routes can be added here
                ]
            }
        ]
    },
    {
        path: "/admin/login",
        element: <AdminLoginPage />
    }
])

export { router }