import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { logout } from '../../features/admin/adminSlice';

const SideBar : React.FC = () => {
  const dispatch : AppDispatch =  useDispatch();
  const [isOpen, setIsOpen] = useState(true);

  return ( 
    <>
    <button
        className="md:hidden p-4 text-3xl text-gray-600"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        )}
      </button>
    <aside className="w-64 bg-white h-screen shadow-md fixed flex flex-col">
        <div className="flex justify-center items-center mt-5">
          <Link to={'/'} className="flex flex-col items-center">
            <img src='/images/AddHotel/Untitled design.png' alt="Logo" className="w-16 h-18 rounded-full" /> 
          </Link>
        </div>          
        <nav className="mt-10 flex-grow">
        <ul>
          <li className="px-6 py-6 text-gray-700 hover:bg-gray-200">
            <Link to="/admin">Dashboard</Link>
          </li>
          <li className="px-6 py-6 text-gray-700 hover:bg-gray-200">
            <Link to="/admin/users">Users</Link>
          </li>
          <li className="px-6 py-6 text-gray-700 hover:bg-gray-200">
            <Link to="/admin/managers">Managers</Link>
          </li>
          <li className="px-6 py-6 text-gray-700 hover:bg-gray-200">
            <Link to="/admin/hotels">Hotels</Link>
          </li>
        </ul>
      </nav>
      <div className="px-6 py-4 mt-auto">
        
        <button
          className="primary hover:text-blue-600 focus:outline-none"
          onClick={() =>dispatch(logout())}
        >
          Logout
        </button>
      </div>
    </aside>
    </>
  );
}

export default SideBar;
