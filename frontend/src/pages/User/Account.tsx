import { LogOut, UserCircle, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppDispatch, RootState } from '../../app/store'
import Spinner from '../../components/Spinner'
import { logout, updateProfile } from '../../features/user/authSlice'
import BookingsPage from './BookingsPage'

export default function Account(): React.JSX.Element | null {
  const { user, isLoading, isSuccess, isError, message } = useSelector((state: RootState) => state.auth)
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState(0)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPhone(user.phone || '')
    } else if (storedUser) {
      setName(storedUser.name)
      setEmail(storedUser.email)
      setPhone(storedUser.phone || '')
    }
  }, [])

  let { subpage } = useParams()
  if (subpage === undefined) {
    subpage = 'profile'
  }

  function linkClasses(type: string | null = null) {
    let classes = 'py-2 px-6 rounded-full transition duration-300'
    if (type === subpage) {
      classes += ' bg-primary text-white'
    } else {
      classes += ' hover:bg-gray-100'
    }
    return classes
  }

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const updatedUserData = { name, email, phone, profileImage }
    dispatch(updateProfile(updatedUserData))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success('Profile updated successfully', {
        className: 'toast-custom',
      })
    }
    if (isError) {
      toast.error(message, {
        className: 'toast-custom',
      })
    }
  }, [isSuccess, isError, message])

  if (isLoading) {
    return <Spinner />
  }

  if (!user) {
    navigate('/')
    return null
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-4">
      <nav className="flex justify-center gap-4 mb-8">
        <Link className={linkClasses('profile')} to={'/user'}>
          My Profile
        </Link>
        <Link className={linkClasses('bookings')} to={'/user/bookings'}>
          My Bookings
        </Link>
      </nav>
      <div>
        {subpage === 'profile' && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-primary text-primary py-4 px-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold ">Profile</h2>
              <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg shadow-lg">
                <Wallet className="text-primary" />
                <span className="text-lg font-semibold">Wallet Balance: ${walletBalance.toFixed(2)}</span>
              </div>
            </div>
            <div className="p-6 flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-40 h-40 rounded-full object-cover border-4 border-primary"
                      />
                    ) : (
                      <UserCircle className="w-40 h-40 text-gray-400" />
                    )}
                    <label
                      htmlFor="profile-image"
                      className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-dark transition duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </label>
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 md:pl-6">
                <form className="space-y-4" onSubmit={handleProfileUpdate}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={phone}
                      onChange={(e) => {
                        console.log("Phone input changed:", e.target.value); 
                        setPhone(e.target.value)}}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-300">
                      Update Profile
                    </button>
                  </div>
                </form>
                {isLoading && <Spinner />}
                {isError && <p className="text-red-500 mt-4">Error: {message}</p>}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    className="flex items-center justify-center w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
                    onClick={() => dispatch(logout())}
                  >
                    <LogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {subpage === 'bookings' && (
          <BookingsPage />
        )}
      </div>
    </div>
  )
}