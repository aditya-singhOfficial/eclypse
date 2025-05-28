// src/components/ErrorPage.tsx
import React from 'react'
import {useNavigate} from 'react-router-dom'
import Logo from '../assets/logo.jpg'
import {Helmet} from "react-helmet-async";

const ErrorPage: React.FC = () => {
    const nav = useNavigate()

    return (
        <>
            <Helmet>
                <title>Error | Eclypse</title>
                <meta name="description" content="An error occurred while trying to load this page."/>
                <link rel="icon" href={Logo}/>
                <meta property="og:title" content="Error | Eclypse"/>
                <meta property="og:description" content="An error occurred while trying to load this page."/>
                <meta property="og:image" content={Logo}/>
            </Helmet>
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
                <img
                    src={Logo}
                    alt="Eclypse Logo"
                    className="w-16 h-16 mb-8"
                />

                <h1 className="text-4xl font-light mb-4">Oops, something went wrong.</h1>

                <p className="max-w-md text-center text-gray-300 mb-8">
                    We couldn’t load this page.
                    Try refreshing, or click the button below to return home.
                </p>

                <button
                    onClick={() => nav('/', {
                        viewTransition: true,
                    })}
                    className="px-6 py-3 bg-white text-black font-medium rounded-md hover:scale-105 transition"
                >
                    Go Home
                </button>
            </div>
        </>
    )
}

export default ErrorPage;
