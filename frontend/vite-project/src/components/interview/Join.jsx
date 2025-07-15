import React from 'react'
import { useNavigate } from 'react-router-dom'
const Join = () => {
    const navigate = useNavigate()
  return (
    <div className='flex justify-center items-center h-80 bg-light-gray'>
        <div className='flex justify-center items-center gap-4   rounded-md'>
            <button className='bg-blue-500 text-white p-2 rounded-md cursor-pointer' onClick={()=>{
                navigate('/create')
            }}>Create New Interview Session</button>
            <button className='bg-blue-500 text-white p-2 rounded-md cursor-pointer' onClick={()=>navigate('/join')}>Join Interview Session</button>
        </div>

    </div>
  )
}

export default Join