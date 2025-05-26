import React from "react"

import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-lg font-bold">
                    MyApp
                </Link>
                <div>
                    <Link to="/" className="text-gray-300 hover:text-white px-3 py-2">
                        Home
                    </Link>
                    <Link to="/about" className="text-gray-300 hover:text-white px-3 py-2">
                        About
                    </Link>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;