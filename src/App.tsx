import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

const App: React.FC = () => {
  // const location = useLocation()
  // const isHomePage = location.pathname === '/'

  return (
    <>
      {/* {!isHomePage && <Navbar />} */}
      <Navbar />
      <Outlet />
    </>
  )
}

export default App
