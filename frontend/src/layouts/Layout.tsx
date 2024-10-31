import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/User/Footer'
import Header from '../components/User/Header'

const Layout = () => {
  return (
    <div className='flex flex-col min-h-screen w-full'>
      <header className='p-4'>
      <Header />
      <hr className='border-t border-gray-300 my-4' />
      </header>
      <main className='flex-grow p-5'>
        <Outlet />
      </main>
      <Footer />
    </div>

  )
}

export default Layout