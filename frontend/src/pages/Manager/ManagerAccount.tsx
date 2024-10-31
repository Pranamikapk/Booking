import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AppDispatch, RootState } from '../../app/store';
import Spinner from '../../components/Spinner';
import { logout, updateProfile } from '../../features/manager/managerSlice';

const ManagerAccount: React.FC = () => {
  const { manager, isLoading, isSuccess, isError, message } = useSelector((state: RootState) => state.managerAuth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  useEffect(() => {
    // Ensure manager data is fully loaded before setting the form fields
    if (manager && manager.name && manager.email && manager.phone) {
      setName(manager.name);
      setEmail(manager.email);
      setPhone(manager.phone);
    }
  }, [manager]);

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedManagerData = { name, email, phone };
    setIsFormSubmitted(true);
    dispatch(updateProfile(updatedManagerData));
  };

  useEffect(() => {
    if (isFormSubmitted) {
      if (isSuccess) {
        toast.success('Profile updated successfully', {
          className: 'toast-custom',
        });
      }
      if (isError) {
        toast.error(message || 'Profile update failed', {
          className: 'toast-custom',
        });
        setIsFormSubmitted(false);
      }
    }
  }, [isSuccess, isError, isFormSubmitted, message]);

  useEffect(() => {
    if (!manager) {
      navigate('/manager/login');
    }
  }, [manager, navigate]);

  if (isLoading || !manager) {
    return <Spinner />;
  }

  return (
    <div>
      <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
        <Link className="py-2 px-6 bg-primary text-white rounded-full" to={'/manager/profile'}>
          My Profile
        </Link>
      </nav>
      <div>
        <div className="text-center max-w-lg mx-auto">
          <h2 className="font-bold text-xl mb-4">Profile</h2>
          <form className="max-w-md mx-auto" onSubmit={handleProfileUpdate}>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full p-2 my-2 border"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full p-2 my-2 border"
            />
            <input
              type="text"
              placeholder="Phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block w-full p-2 my-2 border"
            />
            <button type="submit" className="primary">
              Update Profile
            </button>
          </form>
          {isLoading && <Spinner />}
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full max-w-sm mt-4"
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerAccount;
