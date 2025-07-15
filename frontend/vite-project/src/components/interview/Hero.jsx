import React from "react";

const Hero = () => {
  return (
    <div>
      <div className=" flex flex-col items-center justify-center h-screen">
        <h1 className=" text-4xl font-bold">Welcome to our website</h1>
        <p className=" text-2xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        <button className=" bg-blue-500 text-white p-2 rounded-md cursor-pointer">Read More</button>
      </div>
    </div>
  );
};

export default Hero;
