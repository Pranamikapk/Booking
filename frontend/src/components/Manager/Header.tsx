import React, { MouseEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppDispatch, RootState } from '../../app/store';
import { logout, reset } from '../../features/manager/managerSlice';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { manager } = useSelector((state: RootState) => state.managerAuth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    toast.success('Logged out successfully', {
      className: 'toast-custom',
    });
    navigate('/manager');
  };

  const handleProfileClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!manager) {
      toast.error('Please login to access your profile', {
        className: 'toast-custom',
      });
      navigate('/manager/login');
    } else if (manager.isBlocked) {
      toast.error('Your account is blocked.', {
        className: 'toast-custom',
      });
      localStorage.clear();
      navigate('/manager/login');
    } else {
      setIsDropdownOpen((prev) => !prev);
    }
  };

  const handleOutsideClick = (e: Event) => {
    if (isDropdownOpen && (e.target as Element).closest('.dropdown') === null) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [isDropdownOpen]);

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b shadow-md">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-900 focus:outline-none md:hidden"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <h1 className="ml-4 text-xl font-semibold text-gray-800">Hello , {manager?.name}!</h1>
      </div>

      <div className="relative dropdown ml-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleProfileClick}>
          <div className="flex gap-2 border border-gray-300 rounded-full py-2 px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653Zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438ZM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {manager && isDropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <ul className="py-2">
              {!manager.isBlocked && (
                <>
                  <li>
                    <Link
                      to="/manager/account"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button onClick={onLogout} className="block px-4 py-2 w-full text-left hover:bg-gray-100">
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
