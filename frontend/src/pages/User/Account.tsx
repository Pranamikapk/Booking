import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../../app/store';
import Spinner from '../../components/Spinner.js';
import { logout, updateProfile } from '../../features/user/authSlice';

function Account() : React.JSX.Element | null{
  const { user, isLoading, isSuccess, isError, message } = useSelector((state: RootState) => state.auth)
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');


  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState( '');

  useEffect(() => {
    if (user) {
      setName(user.name );
      setEmail(user.email );
    }else if(storedUser){
      setName(storedUser.name)
      setEmail(storedUser.email)
    }
  }, []);

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  function linkClasses(type: string | null = null) {
    let classes = 'py-2 px-6';
    if (type === subpage) {
      classes += ' bg-primary text-white rounded-full';
    }
    return classes;
  }

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedUserData = { name, email };
    dispatch(updateProfile(updatedUserData));
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Profile updated successfully',{
        className:'toast-custom',
      });
    }
    if (isError) {
      toast.error(message,{
        className:'toast-custom',
      });
    }
  }, [isSuccess, isError, message]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    navigate('/');
    return null 
  }

  return (
    <div >
      <nav className='w-full flex justify-center mt-8 gap-2 mb-8'>
        <Link className={linkClasses('profile')} to={'/user'}>My Profile</Link>
        <Link className={linkClasses('bookings')} to={'/user/bookings'}>My Bookings</Link>
        <Link className={linkClasses('places')} to={'/user/places'}>My Accommodations</Link>
      </nav>
      <div>
      {subpage === 'profile' && (
        <div className='text-center max-w-lg mx-auto'>
          <h2 className='font-bold text-xl mb-4'>Profile</h2>
          <form className='max-w-md mx-auto' onSubmit={handleProfileUpdate}>
            <input
              type="text"
              placeholder='Name'
              name='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='block w-full p-2 my-2 border'
            />
            <input
              type="email"
              placeholder='Email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='block w-full p-2 my-2 border'
            />
            <button type='submit' className='primary'>Update Profile</button>
            {/* <div className='text-center py-2 text-gray-500'>
              Reset Password? <Link className='underline text-black' to={'/reset-password'}>Click here</Link>
            </div> */}
          </form>
          {isLoading && <Spinner />}
          {isError && <p className='text-red-500'>Error: {message}</p>}
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full max-w-sm mt-4"
               onClick={() => dispatch(logout())}>Logout</button>
        </div>
      )}
      {
        subpage === 'bookings' && (
          <div className='text-center max-w-lg mx-auto'>
          <h2 className='font-bold text-xl mb-4'>Bookings</h2>
            
          </div>
        )
      }
      {
        subpage === 'places' && (
          <div className='text-center max-w-lg mx-auto'>
          <h2 className='font-bold text-xl mb-4'>Accommodations</h2>   
          </div>
        )
      }
      </div>
    </div>
  );
}

export default Account;
