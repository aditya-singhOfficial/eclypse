import React from 'react'
import {Outlet} from 'react-router-dom'
import Navbar from './components/Navbar'
// import Footer from './components/Footer'
import Footer from "./components/Footer.tsx";
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

const App: React.FC = () => {
    // const location = useLocation()
    // const isHomePage = location.pathname === '/'

    return (
        <CartProvider>
            <OrderProvider>
                <div className="flex flex-col min-h-screen bg-black text-white">
                    {/* {!isHomePage && <Navbar />} */}
                    <Navbar/>
                    <main className="flex-grow">
                        <Outlet/>
                    </main>
                    <Footer/>
                </div>
            </OrderProvider>
        </CartProvider>
    )
}

export default App
