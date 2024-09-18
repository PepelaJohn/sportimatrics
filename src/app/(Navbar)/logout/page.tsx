'use client'
import { Logout } from '@/api'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const LogoutCOmponent = () => {
    const dispatch = useDispatch()
    const user = useSelector((state:any)=>state.user)
  return (
    <div className='w-full  nav-height flex my-10 text-white-1 text-sm flex-col items-center justify-center'>
        <p>Are you sure you want to log out? <span onClick={()=>Logout(dispatch as React.Dispatch<UnknownAction>, user.email)} className='text-red-600 ml-3 cursor-pointer'>Logout</span></p>
        <Link href={'/'} className='!text-green-400 mt-5'>Back Home</Link>
    </div>
  )
}

export default LogoutCOmponent