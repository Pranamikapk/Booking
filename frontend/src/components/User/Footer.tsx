import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Footer : React.FC = () => {
  const navigate = useNavigate()
  const handleClick = (()=>{
    navigate('/manager/login')
  })
  return (
    <div className='w-full bg-primary py-11'>
      <div className='w-full max-w-screen-xl mx-auto flex justify-between items-center px-4'>
        <div className="flex justify-center items-center ">
          <Link to={'/'} className="flex flex-col items-center">
            <img src='/images/AddHotel/Untitled design.png' alt="Logo" className="w-16 h-18 rounded-full" /> 
          </Link>
        </div>       
         <span className='text-white font-bold tracking-tight flex gap-4'>
            <p className='cursor-pointer'>Wanna list your Hotel ?<button onClick={handleClick} className='bg-white text-primary font-semibold py-1 px-4 rounded-sm shadow-md hover:bg-gray-200 transition duration-300'>
            Click here</button></p>
        </span>
      </div>
    </div>
  )
}

export default Footer