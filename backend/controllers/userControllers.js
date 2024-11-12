import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import TryCatch from "../utils/TryCatch.js";

export const registerUser = TryCatch(async(req,res) => {
    const {name, email, password} = req.body;

    let user = await User.findOne({email})

    if(user) return res.status(400).json({
        message: "Account already existed"
    });

    const hashPassword = await bcrypt.hash(password, 10);

    user = await User.create({
        name, 
        email, 
        password:hashPassword,
    });

    res.status(201).json({
        user,
        message: "User Registered Successfully"
    })
})

export const loginUser = TryCatch(async(req,res) => {
     const {email,password} = req.body

     const user = await User.findOne({email})

     if(!user)
         return res.status(400).json({
       message:"No user with this mail",
     });
       
     const comparePassword = await bcrypt.compare(password, user.password);

     if(!comparePassword)
        return res.status(400).json({
            message:"wrong password",
          });

          res.json({
            user,
            message: "logged in"
          })
})