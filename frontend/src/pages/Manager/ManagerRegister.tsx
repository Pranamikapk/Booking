import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppDispatch, RootState } from '../../app/store'
import OtpModal from '../../components/modals/OtpModal'
import Spinner from '../../components/Spinner'
import { register, reset } from '../../features/manager/managerSlice'

interface FormData {
  hotel: string
  name : string
  email : string
  phone : string 
  password : string 
  licence: string
}

interface FormErrors {
  hotel ?: string
  name ?: string
  email ?: string
  phone ?: string 
  password ?: string 
  licence ?: string
}

function ManagerRegister() {
    const[formData,setFormData] = useState<FormData>({
        hotel: '',
        name:'',
        email:'',
        phone:'',
        password:'',
        licence: ''
    })

    const [formErrors, setFormErrors] = useState<FormErrors>({
        hotel:'',
        name:'',
        email:'',
        phone:'',
        password:'',
        licence: ''
    });

    const {hotel,name,email,phone,password,licence} = formData
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const [showOtpModal ,setShowOtpModal] = useState(false)
    const [otp,setOtp] = useState('')

    const {manager,isLoading,isError,isSuccess,message} = useSelector(
    (state:RootState) => state.managerAuth
    )

    useEffect(()=>{
        if(isError){
            toast.error(message,{
              className:'toast-custom',
            })
        }
        if(isSuccess || manager){
          setShowOtpModal(true); 
        }
    },[manager,isError,isSuccess,message])

    useEffect(()=>{
      if(showOtpModal){
        dispatch(reset())
      }
    },[showOtpModal,dispatch])

    const validateFields = ():FormErrors => {
        let errors : FormErrors = {};
        if (!hotel) {
          errors.hotel = 'Hotel name is required';
        }
        if (!name) {
          errors.name = 'Name is required';
        }
        if (!email) {
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
          errors.email = 'Email is invalid';
        }
        if (!phone) {
          errors.phone = 'Phone is required';
        }else if( phone.length < 10 || phone.length > 10){
          errors.phone = 'Phone must contain 10 digits'
        }
        if (!password) {
          errors.password = 'Password is required';
        }else if( password.length < 6 ){
            errors.password = 'Password must contain atleast 6 digits'
        }
        if (!licence) {
          errors.licence = 'Licence is required'
        } else if (!/^[A-Z]{2}\d{6}$/.test(licence)) {
          errors.licence = 'Licence must be in format: AA123456'
        }
        return errors;
      };

    const onChange = (e : ChangeEvent<HTMLInputElement>) =>{
        const {name,value} = e.target
        setFormData((prevState)=>({
            ...prevState,
            [name] : value
        }))
    }

    const onSubmit = async(e : FormEvent) =>{
        e.preventDefault()
        const errors = validateFields();
        if (Object.keys(errors).length > 0) {
          setFormErrors(errors);
          return;
        } else {
          setFormErrors({hotel:'',name:'', email: '',phone: '', password: '' });
        }
        dispatch(reset())
        const managerData = {
            hotel,
            name,
            email,
            phone,
            licence,
            password
        }
        console.log(managerData);
        try {
          const resultAction = await dispatch(register(managerData));
          if (register.fulfilled.match(resultAction)) {
            toast.success('Manager Registered Successfully', {
              className: 'toast-custom',
            });
            setShowOtpModal(true);
          } else {
            throw new Error(resultAction.error.message);
          }
        } catch (error) {
          console.error('Error in registration', error);
          toast.error('Some Error occurred in registration', {
            className: 'toast-custom',
          });
        }
    }

    const resendOtp = async() => {
      try {
        const response = await fetch('http://localhost:3000/manager/resendOtp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email}),
        });

        const data = await response.json()
        if(response.ok){
          toast.success('OTP resent successfully',
            {
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

    const handleOtpSubmit = async(): Promise<boolean> =>{
      console.log('Submitting OTP:', { email, otp });
      try {
        const response = await fetch('http://localhost:3000/manager/verifyOtp', {
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
            navigate('/manager')
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

    const decodeJWT = (token) => {
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
  
      const googleManagerData = {
        name : decoded.name,
        email : decoded.email,
        token : credentialResponse.credential
      }
  
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
          toast.success('Logged-in with Google',{
            className:'toast-custom'
          })
        } else {
          toast.error('Failed to log in with Google',{
            className:'toast-custom',
          });
        }
      } catch (error) {
        toast.error('Error logging in with Google',{
          className:'toast-custom',
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
                placeholder='hotelName' 
                value={hotel} 
                name='hotel'
                onChange={onChange} 
                className={`w-full p-2 border ${
                    formErrors.hotel ? 'border-red-500' : 'border-gray-300'
                  } rounded`}/>
                {formErrors.hotel && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.hotel}</p>
                )}
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
            <input type="text" 
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
            <input type="text" 
                placeholder='phone' 
                value={phone} 
                name='phone'
                onChange={onChange}
                className={`w-full p-2 border ${
                    formErrors.phone ? 'border-red-500' : 'border-gray-300'
                  } rounded`}/>
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                )}
             <input 
                type="text" 
                placeholder='Licence (Format: AA123456)' 
                name='licence' 
                value={licence} 
                onChange={onChange} 
                className={`w-full p-2 border ${
                  formErrors.licence ? 'border-red-500' : 'border-gray-300'
                } rounded`}
              />
              {formErrors.licence && (
                <p className="text-red-500 text-sm mt-1">{formErrors.licence}</p>
              )}
            <input type="password" 
                placeholder='password'
                name='password' 
                value={password} 
                onChange={onChange}
                className={`w-full p-2 border ${
                    formErrors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded`}/>
                {formErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                )}
            <button className='primary' type='submit'>Register</button>
            <div className='text-center py-2 text-gray-500'>
                Already a member? <Link className='underline text-black' to={'/manager/login'}>Login</Link>
            </div>
            <p className='flex items-center justify-center'>or</p>

            <div className='flex items-center justify-center '>
            <GoogleOAuthProvider clientId="293848133299-j244kbmvd1ctapc53in7vj6mm628emdm.apps.googleusercontent.com">   
            <GoogleLogin 
              onSuccess={handleGoogleSuccess}/>
            </GoogleOAuthProvider>
            { showOtpModal && (
              <OtpModal
              isVisible={showOtpModal}
              otp={otp}
              setOtp={setOtp}
              resendOtp ={resendOtp}
              onSubmit={handleOtpSubmit}
              closeModal={() => setShowOtpModal(false)}
            />
            )}
            </div>
        </form>
        </div>
        </div>
    </div>
  )
}

export default ManagerRegister