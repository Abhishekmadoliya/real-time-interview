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
          <input type="email" id="email" name="email" required onChange={(e)=>setFormdata({...formdata,email:e.target.value})}/>
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required onChange={(e)=>setFormdata({...formdata,username:e.target.value})}/>
        </div>
        
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required onChange={(e)=>setFormdata({...formdata,password:e.target.value})}/>
        </div>
        
        <div>
          <label htmlFor="role">role:</label>
          <input type="text" id="role" name="role" required onChange={(e)=>setFormdata({...formdata,role:e.target.value})}/>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default Signup
