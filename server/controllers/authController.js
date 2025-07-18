const User = require("../models/usermodel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.login = async(req,res)=>{
  try {
    const {email,password} = req.body;
    // check if userexist
    if(!email || !password){
      return res.json({message:"email & password required"}).status(400);
    }
    const userexist = await User.findOne(email);
    if(!userexist){
      return res.json({message:"user not registered"}).status(400);

    }

    const isMatched = bcrypt.compare(password, userexist.password)
   if(!checkpass){
      return res.status(400).json({message: "password not matched"});
   }

   const token = jwt.sign({
    user:userexist.id,
    name:userexist.name,
    email:userexist.email
   },"this is an secrete key",{expiresIn:"15d"})


   res.status(200).json({message:"user logged in", token:token,status:200})

  } catch (error) {
    
  }
}



exports.signup = async (req,res) => {
  try {
    const {email,password,username,role} = req.body;
    if(!email || !password || !username || !role){
      res.status(400).json({message:"all fields are required"});
    }
    // check id email already in database

    const isregistered = await User.findOne(email);
    if(isregistered){
      res.status(400).json({message:"user already registered ",status:400})
    }

    const saltvalue = 10;
    const hashedpass = await bcrypt.hash(password,saltvalue);

    const newUser = new User({
      username: username,
      email:email,
      role:role,
      password:hashedpass
    })

    await newUser.save();
    res.status(201).json({message:"user registered successfully",status:201})
    
  } catch (error) {
    
  }
}
