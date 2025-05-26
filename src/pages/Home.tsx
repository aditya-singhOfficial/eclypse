import React from "react";

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-amber-500">
            <h1 className="text-4xl font-bold mb-4">Welcome to My App</h1>
            <p className="text-lg text-gray-700">This is the home page.</p>
        </div>
    );
}

export default Home;