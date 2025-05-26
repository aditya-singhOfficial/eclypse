import { createBrowserRouter } from "react-router-dom"
import App from "./App"
import Home from "./pages/Home"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <div>Something went wrong!</div>,
        children: [
            {
                path: "",
                element: <Home />
            }
        ]
    }
])

export { router }