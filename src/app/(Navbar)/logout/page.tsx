'use client'

import React from 'react'
import Link from 'next/link'
import { LogOut, Home } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Logout } from '@/api'

const LogoutComponent = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.user)
  
  const handleLogout = () => {
    Logout(dispatch as React.Dispatch<UnknownAction>, user.email)
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md w-full border border-gray-500 border-opacity-20 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 bg-opacity-50 text-gray-300 text-3xl">
            <LogOut size={28} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white-1 mb-6">Ready to leave?</h2>
        
        <p className="text-gray-300 mb-8">
          Are you sure you want to log out of your account?
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white-1 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
          
          <Link 
            href="/"
            className="bg-transparent hover:bg-gray-800 border border-gray-500 text-white-1 px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Home className='text-white-1' size={18} />
            <span className='text-white-1'>Back Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LogoutComponent