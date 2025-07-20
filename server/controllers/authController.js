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



exports.signup = async (req, res) => {
  try {
    const { email, password, username, role } = req.body;

    if (!email || !password || !username || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email is already registered
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return res.status(409).json({ message: "User already registered", status: 409 });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      role,
      password: hashedPassword
    });

    await newUser.save();
    return res.status(201).json({ message: "User registered successfully", status: 201 });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", status: 500 });
  }
};

