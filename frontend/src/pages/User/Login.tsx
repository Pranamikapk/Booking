import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../../app/store';
import ForgotPasswordModal from '../../components/modals/ForgotPasswordModal';
import Spinner from '../../components/Spinner';
import { googleLogin, login, reset } from '../../features/user/authSlice';

interface FormData{
  email : string
  password : string
}

interface FormErrors{
  email : string
  password : string
}

const Login : React.FC = () => {
  const[formdata,setFormData] = useState<FormData>({
    email:'',
    password:''
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: '',
    password: '',
  });

  const {email,password} = formdata

  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const {user,isLoading,isError,isSuccess,message} = useSelector(
    (state:RootState) => state.auth
  )

  const [isResetModalVisible, setResetModalVisible] = useState<boolean>(false);


  useEffect(()=>{
    if(isError){
      toast.error(message,{
        className:'toast-custom',
      })
    }
    if( isSuccess && user && !user.isBlocked ){
      navigate('/')
      toast.success('Logged-in Successfully',{
        className:'toast-custom',
      })
      dispatch(reset())
    }
  },[user,isError,isSuccess,message,navigate,dispatch])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const { name , value} = e.target
    setFormData((prevState)=>({
      ...prevState,
      [name] : value
    }))
    setFormErrors((prevState) => ({
      ...prevState,
      [name]: ''
    }));
  }

  const validateFields = (formdata : FormData): FormErrors => {
    console.log("formdata:",formdata);
    
    let errors : FormErrors = {email :'' , password : ''};
    if (!formdata.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formdata.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formdata.password) {
      errors.password = 'Password is required';
    }
    console.log('Validation Errors:',errors);
    return errors;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log(email);
    
  
    const errors = validateFields(formdata);
    console.log(errors);
    
    if(errors.email || errors.password){
      setFormErrors(errors)
      return
    }
  
    const userData = { email:formdata.email, password : formdata.password};
    console.log('Submitting:', userData)
  
    try {
      const result = await dispatch(login(userData)).unwrap();
      console.log('Result:',result);
      
      if (result.isBlocked) {
        toast.error('Your account is blocked.', { className: 'toast-custom' });
      } else {
        toast.success('Logged in successfully!', { className: 'toast-custom' });
        navigate('/');
      }
    } catch (error: any) {
      console.error('Error:',error);
      setFormErrors({
        email: '',
        password: 'Invalid credentials', 
      });
      toast.error(error || 'Login failed', { className: 'toast-custom' });
    }
  };
  
  
  
  const handleForgotPassword = async() => {
    setResetModalVisible(true)
  }

  const handleForgotPasswordSubmit = async() => {
    try {
      const response = await fetch('http://localhost:3000/forgotPassword', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), });

      const result = await response.json(); 
        if (!response.ok) {
            throw new Error(result.message || 'Something went wrong.');
        }
        return result; 
    } catch (error) {
      return { error: error.response?.data?.message || 'Server error' }; 
    }
  };

  if(isLoading){
    return <Spinner/>
  }

  // const decodeJWT = (token) => {
  //   const base64Url = token.split('.')[1];
  //   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //   const jsonPayload = decodeURIComponent(
  //     atob(base64)
  //       .split('')
  //       .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
  //       .join('')
  //   );
  //   return JSON.parse(jsonPayload);
  // };

  const handleGoogleSuccess = async (credentialResponse) => {
    // const decoded = decodeJWT(credentialResponse.credential);
    const token = credentialResponse.credential
    // const googleUserData = {
    //   name: decoded.name,
    //   email: decoded.email,
    // };
  
    try {
      const result = await dispatch(googleLogin(token)); 
      if (googleLogin.fulfilled.match(result)) {
        toast.success('Logged in with Google', {
          className: 'toast-custom',
        });
        navigate('/', { replace: true });
      } else {
        console.error(result.error.message);
        toast.error(result.error.message || 'Failed to log in with Google', {
          className: 'toast-custom',
        });
      }
    } catch (error) {
      console.error('Error logging in with Google:', error);
      toast.error('Error logging in with Google', {
        className: 'toast-custom',
      });
    }
  };
  

  return (
    <div className='min-h-screen flex items-center justify-center '>
        <div className='bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md'>
        <div className="p-6 space-y-6">
        <div className="flex justify-center items-center mb-6">
          <Link to={'/'} className="flex flex-col items-center">
            <img src='/images/AddHotel/Untitled design.png' alt="Logo" className="w-24 h-24 rounded-full" /> 
          </Link>
        </div>

        <h1 className='text-4xl text-center mb-4'>Login</h1>
        <form className='space-y-6' onSubmit={onSubmit}>
            <input type="email" 
              placeholder='your@email.com'
              name='email'
              value={email}
              onChange={onChange} 
              className={`w-full p-2 border ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                } rounded`}/>
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            <input type="password" 
              placeholder='password'
              name='password'
              value={password}
              onChange={onChange}
              className={`w-full p-2 border ${
                formErrors.password ? 'border-red-500' : 'border-gray-300'
              } rounded`} />
              {formErrors.password && (
                <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
              )}
            <button type='submit' className='primary'>Login</button>
            <div className='text-center py-2 text-gray-500'>
              <span className='underline cursor-pointer' onClick={handleForgotPassword}>Forgot Password?</span>
            </div>
            <div className='text-center py-2 text-gray-500'>
                Don't have an account yet? <Link className='underline text-black' to={'/register'}>Register now</Link>
            </div>
            <p className='flex items-center justify-center'>or</p>
            <div className='flex items-center justify-center '>

            
            <GoogleOAuthProvider clientId="293848133299-j244kbmvd1ctapc53in7vj6mm628emdm.apps.googleusercontent.com">   
            <GoogleLogin 
              onSuccess={handleGoogleSuccess}
            />
            </GoogleOAuthProvider>
            <ForgotPasswordModal
              isVisible={isResetModalVisible} 
              onSubmit={handleForgotPasswordSubmit}
              closeModal={() => setResetModalVisible(false)} />
            </div>
        </form>
        </div>
        </div>
    </div>
  )
}

export default Login