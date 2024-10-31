import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppDispatch, RootState } from '../../app/store';
import { logout, reset } from '../../features/user/authSlice';

const Header : React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    toast.success('Logged out successfully',{
      className:'toast-custom'
    });
    navigate('/');
  };

  const handleProfileClick = (e : React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!user) {
      toast.error('Please login to access your profile',{
         className:'toast-custom'
      });
      navigate('/login');
    }else if (user.isBlocked) {
      toast.error('Your account is blocked.',{
         className:'toast-custom'
      });
      console.log('Navigating...');
      navigate('/login');

      localStorage.clear(); 
    } else {
      setIsDropdownOpen((prev) => !prev);
    }
  };

  const handleOutsideClick = (e : Event) => {
    if (isDropdownOpen && (e.target as HTMLElement).closest('.dropdown') === null) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [isDropdownOpen,user]);

  return (
    <div className="flex justify-between">
       <div className="flex justify-center items-center ">
          <Link to={'/'} className="flex flex-col items-center">
            <img src='/images/AddHotel/Untitled design.png' alt="Logo" className="w-12 h-12 rounded-full" /> 
          </Link>
        </div>
      {/* <div className="flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-100 items-center whitespace-nowrap">
        <div>Anywhere</div>
        <div className="border-l border-gray-300 h-6"></div>
        <div>Any week</div>
        <div className="border-l border-gray-300 h-6"></div>
        <div>Add guests</div>
        <button className="bg-primary text-white p-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div> */}

      <div className="relative dropdown">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleProfileClick}>
          <div className="flex gap-2 border border-gray-300 rounded-full py-2 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653Zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438ZM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {user && isDropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <ul className="py-2">
            {!user.isBlocked && (
              <div>
                <li>
                  <Link to="/user" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                    Profile
                  </Link>
                </li>
                <li>
                <button onClick={onLogout} className="block px-4 py-2 hover:bg-gray-100">
                  Logout
                </button>
              </li>
              </div>
              )}
              
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
