import React from "react";

const Navbar = () => {
  return (
    <div>
      <nav className=" flex justify-between items-center p-4 bg-black">
        <ul className=" flex gap-4 text-white">
          <li>Home</li>
          
          <li>About</li>
          <li>Contact</li>
        </ul>

        <div className=" flex gap-4 text-white">
        <button className=" bg-blue-500 text-white p-2 rounded-md cursor-pointer">Log in</button>
          <button className=" bg-blue-500 text-white p-2 rounded-md cursor-pointer">Sign Up</button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
