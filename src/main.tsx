import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {RouterProvider} from 'react-router-dom'
import {router} from './router.tsx'
import {HelmetProvider} from "react-helmet-async";
import { AdminAuthProvider } from './admin/contexts/AdminAuthContext'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AdminAuthProvider>
            <HelmetProvider>
                <RouterProvider router={router}/>
            </HelmetProvider>
        </AdminAuthProvider>
    </StrictMode>,
)
