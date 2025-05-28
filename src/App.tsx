import React from 'react'
import {Outlet} from 'react-router-dom'
import Navbar from './components/Navbar'
// import Footer from './components/Footer'
import Footer from "./components/Footer.tsx";
import { CartProvider } from './context/CartContext';

const App: React.FC = () => {
    // const location = useLocation()
    // const isHomePage = location.pathname === '/'

    return (
        <CartProvider>
            <div className="flex flex-col min-h-screen bg-black text-white">
                {/* {!isHomePage && <Navbar />} */}
                <Navbar/>
                <main className="flex-grow">
                    <Outlet/>
                </main>
                <Footer/>
            </div>
        </CartProvider>
    )
}

export default App
