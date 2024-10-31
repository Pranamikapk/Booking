import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppDispatch, RootState } from '../../app/store'
import OtpModal from '../../components/modals/OtpModal'
import Spinner from '../../components/Spinner'
import { register, reset } from '../../features/user/authSlice'


interface FormData{
  name : string 
  email : string
  password: string
}

interface FormErrors{
  name : string
  email : string
  password : string
}

const Register : React.FC = () => {
    const[formData,setFormData] = useState<FormData>({
        name:'',
        email:'',
        password:''
    })

    const [formErrors, setFormErrors] = useState<FormErrors>({
        name:'',
        email:'',
        password:''
    });

    const {name,email,password} = formData
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const [showOtpModal ,setShowOtpModal] = useState<boolean>(false)
    const [otp,setOtp] = useState<string>('')

    const {user,isLoading,isError,isSuccess,message} = useSelector(
    (state:RootState) => state.auth
    )

    useEffect(() => {
      const modalState = localStorage.getItem('showOtpModal')
      console.log("Modal state from localStorage:", modalState) 
      if (isSuccess && modalState === 'true') {
        setShowOtpModal(true)
        console.log("OTP Modal set to true after reload")
      }
    }, [isSuccess])

    useEffect(()=>{
        if(isError){
          toast.error(message,{
            className:'toast-custom',
          })
        }
        if(isSuccess && !showOtpModal){
            setShowOtpModal(true); 
            toast.success('User Registered successfully',{
              className:'toast-custom'
            })
            localStorage.setItem('showOtpModal', 'true')
          }
    },[isError,isSuccess,message, showOtpModal])
    

    useEffect(()=>{
      if(showOtpModal){
        dispatch(reset())
      }
    },[showOtpModal,dispatch])

    const onChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
        const {name,value} = e.target
        setFormData((prevState)=>({
            ...prevState,
            [name] : value
        }))
    }

    const validateFields = (formData : FormData): FormErrors => {
      let errors : FormErrors = { name : '' , email : '' , password : ''};
      if (!formData.name) {
        errors.name = 'Name is required';
      }
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email is invalid';
      }
      if (!formData.password) {
        errors.password = 'Password is required';
      }else if(formData.password.length < 6){
        errors.password = 'Password must be atleast 6 characters';
      }
      return errors;
    };

    const onSubmit =async (e : React.FormEvent) =>{
        e.preventDefault()
        console.log('Form submitted');
        const errors = validateFields(formData);
        if (Object.keys(errors).some((key) => errors[key as keyof FormErrors])) {
          setFormErrors(errors);
          return;
        } else {
          setFormErrors({ name: '', email: '', password: '' });
        }
        const userData = {
          name,
          email,
          password,
        }
        console.log(userData);
        
        dispatch(register(userData))

        .then((res)=>{
          console.log('Registration res:',res);
          setShowOtpModal(true)
          localStorage.setItem('showOtpModal', 'true')
          console.log('showOtpModal:',localStorage.getItem('showOtpModal'));
        }).catch((err)=>{
          console.error('Error in registration',err);
        })

        dispatch(reset())
    }

    const resendOtp = async() => {
      try {
        const response = await fetch('http://localhost:3000/resendOtp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email}),
        });

        const data = await response.json()
        if(response.ok){
          toast.success('OTP resent successfully',{
            className:'toast-custom',
          });
          
        }else{
          toast.error('Failed to resent Otp',{
            className:'toast-custom',
          });
        }
      } catch (error) {
        console.error('Error resending OTP:', error);
        toast.error('Error resending OTP',{
          className:'toast-custom',
        });
      }
    }

    const handleOtpSubmit = async() : Promise<boolean>=>{
      console.log('Submitting OTP:', { email, otp });
      try {
        const response = await fetch('http://localhost:3000/verifyOtp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email,otp }), 
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === 'Invalid OTP') {
            setOtp('');
            setShowOtpModal(true)
            localStorage.removeItem('showOtpModal')
            toast.error('Invalid OTP, please try again',{
              className:'toast-custom',
            });
            return false
          } else {
            throw new Error(`Error: ${response.status}`);
          }
        }else{
          const data = await response.json();
          if (data.success) {
            setShowOtpModal(false) 
            toast.success('OTP verified successfully',{
              className:'toast-custom',
            });
            navigate('/')
            return true
          }
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        toast.error('Error verifying OTP',{
          className:'toast-custom',
        });
        return false
      }
      return false
    }

    if(isLoading){
        return <Spinner/>
    }

    const decodeJWT = (token : string) => {
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
  
    const handleGoogleSuccess = async(credentialResponse) => {
      const decoded = decodeJWT(credentialResponse.credential)
  
      const googleUserData = {
        name : decoded.name,
        email : decoded.email,
        token : credentialResponse.credential
      }
  
      try {
        const response = await fetch('http://localhost:3000/api/auth/google-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(googleUserData),
        });
    
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/', { replace: true });
          toast.success('Logged-in with Google',{
            className:'toast-custom'
          })
        } else {
          toast.error('Failed to log in with Google',{
            className:'toast-custom'
          });
        }
      } catch (error) {
        toast.error('Error logging in with Google',{
          className:'toast-custom'
        });
      }
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
    <div className='bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md'>
    <div className="p-6 space-y-6">
        <h1 className='text-4xl text-center mb-4'>Register</h1>
        <form className='space-y-6' onSubmit={onSubmit}>
            <input type="text" 
                placeholder='name' 
                value={name} 
                name='name'
                onChange={onChange}
                className={`w-full p-2 border ${
                  formErrors.name ? 'border-red-500' : 'border-gray-300'
                } rounded`}/>
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            <input type="email" 
                placeholder='your@email.com' 
                value={email} 
                name='email'
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
            <button className='primary' type='submit'>Register</button>
            <div className='text-center py-2 text-gray-500'>
                Already a member? <Link className='underline text-black' to={'/login'}>Login</Link>
            </div>
            <p className='flex items-center justify-center'>or</p>

            <div className='flex items-center justify-center '>
            <GoogleOAuthProvider clientId="293848133299-j244kbmvd1ctapc53in7vj6mm628emdm.apps.googleusercontent.com">   
              <GoogleLogin 
                onSuccess={handleGoogleSuccess}/>
            </GoogleOAuthProvider>
            </div>
        </form>
        </div>
        </div>
        { showOtpModal && (
              <OtpModal
              isVisible={showOtpModal}
              otp={otp}
              setOtp={setOtp}
              resendOtp ={resendOtp}
              onSubmit={handleOtpSubmit}
              closeModal={() => {
                setShowOtpModal(false)
                }
              }
            />
            )}
    </div>
  )
}

export default Register
