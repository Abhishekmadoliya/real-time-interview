import React, { useEffect, useState } from 'react'

const Signup = () => {

    const [formdata,setFormdata] = useState({email:"",
        username:"",
        role:"",
        password:""
    });


    useEffect(() => {
      
    console.log(formdata);
    
    }, [formdata])
    
  return (
    <div>
      <h2>Signup</h2>
      <form>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required onChange={(e)=>setFormdata(formdata.email = e.target.value)}/>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default Signup
