import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../../app/store';
import ForgotPasswordModal from '../../components/modals/ForgotPasswordModal';
import { login, reset } from '../../features/manager/managerSlice';

interface ManagerCredentials {
  email: string;
  password: string;
}

interface GoogleCredentialResponse {
  credential: string;
}

const ManagerLogin: React.FC = () => {
  const [formdata, setFormData] = useState<ManagerCredentials>({
    email: '',
    password: ''
  });

  const [formErrors, setFormErrors] = useState<ManagerCredentials>({
    email: '',
    password: ''
  });

  const { email, password } = formdata;

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [isResetModalVisible, setResetModalVisible] = useState<boolean>(false);
  const { manager, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.managerAuth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message, {
        className: 'toast-custom',
      });
    }
    if (isSuccess && manager && !manager.isBlocked) {
      navigate('/manager');
      toast.success('Logged-in Successfully', {
        className: 'toast-custom',
      });
      dispatch(reset());
    }
  }, [manager, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
    setFormErrors((prevState) => ({
      ...prevState,
      [e.target.name]: ''
    }));
  };

  const validateFields = (): ManagerCredentials => {
    let errors: ManagerCredentials = { email: '', password: '' };
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateFields();
    if (errors.email || errors.password) {
      setFormErrors(errors);
      return;
    } else {
      setFormErrors({ email: '', password: '' });
    }
    const managerData = {
      email,
      password
    };
    const result = await dispatch(login(managerData)).unwrap();
    console.log(result);

    if (result && result.isBlocked) {
      toast.error('Your account is blocked.', {
        className: 'toast-custom'
      });
    }
    if (result.meta.requestStatus === 'rejected') {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        password: 'Invalid credentials',
      }));
    }
  };

  const handleForgotPassword = () => {
    setResetModalVisible(true);
  };

  const handleForgotPasswordSubmit = async (email: string): Promise<{ error?: string } | undefined> => {
    try {
      const response = await fetch('http://localhost:3000/forgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      toast.success('Password reset link sent!', {
        className: 'toast-custom',
      });
      return undefined
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
        className: 'toast-custom',
      });
    }
  };

  const decodeJWT = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    
    if (!credentialResponse.credential) {
      toast.error('Google authentication failed', {
        className: 'toast-custom',
      });
      return;
    }
  
    const decoded = decodeJWT(credentialResponse.credential);

    const googleManagerData = {
      name: decoded.name,
      email: decoded.email,
      token: credentialResponse.credential
    };

    try {
      const response = await fetch('http://localhost:3000/manager/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleManagerData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('manager', JSON.stringify(data.manager));
        navigate('/manager', { replace: true });
      } else {
        toast.error('Failed to log in with Google', {
          className: 'toast-custom',
        });
      }
    } catch (error) {
      toast.error('Error logging in with Google', {
        className: 'toast-custom',
      });
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md'>
        <div className="p-6 space-y-6">
        <div className="flex justify-center items-center mb-6">
        <Link to="/" className="flex flex-col items-center">
          <img src="/images/AddHotel/SE3.png" alt="Logo" className="w-28 h-20 rounded-full" />
        </Link>
        </div>
          <h1 className='text-4xl text-center mb-4'>Manager Login</h1>
          <form className='space-y-6' onSubmit={onSubmit}>
            <input
              type="email"
              placeholder='your@email.com'
              name='email'
              value={email}
              onChange={onChange}
              className={`w-full p-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
            <input
              type="password"
              placeholder='password'
              name='password'
              value={password}
              onChange={onChange}
              className={`w-full p-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
            <button type='submit' className='primary'>Login</button>
            <div className='text-center py-2 text-gray-500'>
              <span className='underline cursor-pointer' onClick={handleForgotPassword}>Forgot Password?</span>
            </div>
            <div className='text-center py-2 text-gray-500'>
              Don't have an account yet? <Link className='underline text-black' to={'/manager/register'}>Register now</Link>
            </div>
            <p className='flex items-center justify-center'>or</p>
            <div className='flex items-center justify-center'>
              <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
                <GoogleLogin onSuccess={handleGoogleSuccess} />
              </GoogleOAuthProvider>
            </div>
          </form>
        </div>
      </div>
      <ForgotPasswordModal
        isVisible={isResetModalVisible}
        onSubmit={handleForgotPasswordSubmit}
        closeModal={() => setResetModalVisible(false)}
      />
    </div>
  );
};

export default ManagerLogin;
