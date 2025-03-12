import { Loader } from 'lucide-react'
import React from 'react'

const LoaderSpinner = () => {
  return (
    <div className="flex-center h-[80vh] z-50 w-full">
      <Loader className="animate-spin text-green-400" size={30} />
    </div>
  )
}

export default LoaderSpinner