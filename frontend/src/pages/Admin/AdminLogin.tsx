import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppDispatch, RootState } from '../../app/store'
import Spinner from '../../components/Spinner'
import { login } from '../../features/admin/adminSlice'

interface AdminCredentials {
  email : string
  password : string
}

const AdminLogin : React.FC = () =>{
  const[adminData,setAdminData] = useState<AdminCredentials>({
    email : '',
    password: ''
  })

  const [formErrors, setFormErrors] = useState<AdminCredentials>({
    email: '',
    password: '',
  });

  const {email,password} = adminData
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const {admin,isLoading,isError,isSuccess,message} = useSelector((state: RootState)=>state.adminAuth)

  useEffect(()=>{
    if(isError){
      toast.error(message,{
        className:'toast-custom',
      }) 
    }
    if(isSuccess || admin){
      navigate('/admin',{replace:true})
      toast.success(
        'Admin Loggedin successfully',{
          className:'toast-custom',
        }
      )
    }
  },[admin,isError,isLoading,isSuccess,message,navigate,dispatch])

  const onChange = (e : ChangeEvent<HTMLInputElement>) => {
    const {name,value} = e.target
    setAdminData((prevState)=>({
      ...prevState,
      [name] : value
    }))
    setFormErrors((prevState) => ({
      ...prevState,
      [name]: ''
    }));
  }

  const validateFields = (adminData : AdminCredentials) :AdminCredentials => {
    let errors: AdminCredentials = {email: '' ,password:''};
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

  const onSubmit = async(e : FormEvent) =>{
    e.preventDefault()
    console.log("submitted");
    
    const errors = validateFields(adminData);
    
    if(errors.email || errors.password){
      setFormErrors(errors)
      return
    }

    const adminCred : AdminCredentials = {
      email,
      password
    }
    const result = await dispatch(login(adminCred))
      if (result.meta.requestStatus === 'rejected') {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          password: 'Invalid credentials',
        }));
      }
    
  }

  if(isLoading){
    return <Spinner/>
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md">
        <div className="p-6 space-y-6">
          <div className="flex justify-center items-center mb-6">
            <Link to={'/'} className="flex flex-col items-center">
              <img src='/images/AddHotel/Untitled design.png' alt="Logo" className="w-24 h-24 rounded-full" /> 
            </Link>
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-900">Admin Login</h2>
          <p className="text-center text-gray-600 mb-8">
            Sign in to your admin dashboard
          </p>
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="Enter your email"
                  className={`w-full p-2 border ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded`} />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="password"
                  className={`w-full p-2 border ${
                    formErrors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded`} />
                  {formErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                  )}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-primary text-white rounded-lg py-2 font-medium hover:bg-primary-dark transition duration-200"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  )
}

export default AdminLogin