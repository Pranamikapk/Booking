import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { AppDispatch } from '../../app/store'
import { logout } from '../../features/manager/managerSlice'

interface SideBarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const SideBar: React.FC<SideBarProps> = ({ isOpen, toggleSidebar }) => {
  const dispatch: AppDispatch = useDispatch()

  const navItems = [
    { to: "/manager", label: "Dashboard" },
    { to: "/manager/hotels", label: "Hotels" },
    { to: "/manager/reservations", label: "Reservations" },
    { to: "/manager/inbox", label: "Inbox" },
    { to: "/manager/transactions", label: "Transactions" },
  ]

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
        <div className="flex justify-center items-center mx-20">
          <Link to={'/'} className="flex flex-col items-center">
            <img src='/images/AddHotel/Untitled design.png' alt="Logo" className="w-16 h-18 rounded-full" /> 
          </Link>
        </div>              
        <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            aria-label="Close sidebar"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.to} className="mb-4"> 
                <Link
                  to={item.to}
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out"
                  onClick={() => toggleSidebar()}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  )
}

export default SideBar;
