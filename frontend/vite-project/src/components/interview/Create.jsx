import React from "react";

const Create = () => {
  return (
    <>
      <div className="flex justify-center items-center h-screen gap-4">
        <div className="flex justify-center items-center gap-4">
          <input
            type="text"
            placeholder="Enter interview title"
            className="border-2 border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex justify-center items-center gap-4">
          <button className="bg-blue-500 text-white p-2 rounded-md cursor-pointer">
            Create New Interview Session
          </button> 
          {/* <input type="text" name="" id="" placeholder='Session ID' className='border-2 border-gray-300 rounded-md p-2'/> */}


        </div>
      </div>

      
        
      


    {/* //     <div className='flex justify-center items-center h-screen gap-4'>
    //         <input type="text" name="" id="" placeholder='Session ID' className='border-2 border-gray-300 rounded-md p-2'/>
    //         <button className='bg-blue-500 text-white p-2 rounded-md cursor-pointer'>Join Interview Session</button>

    //     </div>
    // </div> */}


    </>
  );
};

export default Create;
