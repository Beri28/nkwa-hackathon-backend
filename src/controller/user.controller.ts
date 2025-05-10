import { Request, Response, NextFunction } from 'express';
import User from '../model/user.model';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import PersonalAccount from '../model/personalAccount.model';
import MerchantAccount from '../model/merchantAccount.model';

export const create=async(req: Request, res: Response)=>{
    try {
        console.log("Signup request received:", req.body);  // Log incoming request data

        const { username, email, password } = req.body;

        // Check if all required fields are provided
        if (!email || !password) {
            console.error("Signup failed: Missing required fields");
            res.json({ message: "All fields are required" });
            return
        }

        console.log("Checking if user already exists...");
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            console.warn("Signup failed: User already exists");
            res.status(400).json({ message: "User already exists" });
            return
        }

        console.log("Generating salt for password hashing...");
        const salt = await bcrypt.genSalt(10);

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Password hashed successfully");

        console.log("Creating new user...");
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        const newPersonalAccount=await PersonalAccount.create({
            userId:newUser._id
        })
        newUser.personalAccount=newPersonalAccount._id
        let updatedNewUser= await User.findByIdAndUpdate(newUser._id,{
            personalAccount:newPersonalAccount._id
        }).populate('personalAccount')

        console.log("User created successfully:", updatedNewUser);

        // console.log("Generating JWT token...");
        // const token = jwt.sign(
        //     { id: newUser.id },
        //     process.env.JWT_SECRET || " ",
        // );

        // console.log("Signup successful. Responding with token and user data...");
        // res.status(201).json({
        //     success: true,
        //     message: `${username} created successfully`,
        //     data: { token, user: newUser }
        // });
        res.json({updatedNewUser})
    } catch (error) {
        console.log(error)
        res.json({error})
    }
}

export const createMerchantAccount=async(req: Request, res: Response)=>{
    try {
        console.log("Signup request received:", req.body);  // Log incoming request data

        const { id } = req.body;

       
        const existingUser = await User.findById({ id })
        if (!existingUser) {
            console.warn("Signup failed: User doesn't exists");
            res.status(400).json({ message: "User doesn't exists" });
            return
        }
        const newMerchantAccount=await MerchantAccount.create({
            userId:existingUser._id
        })
        existingUser.personalAccount=newMerchantAccount._id
        let updatedExistingUser= await User.findByIdAndUpdate(existingUser._id,{
            merchantAccount:newMerchantAccount._id
        }).populate('personalAccount').populate('merchantAccount')

        res.json({updatedExistingUser})

    } catch (error) {
        console.log(error)
        res.json({error})
    }
}

export const getOne=async(req: Request, res: Response)=>{
    try {
        const {id}=req.query
        const user=await User.findById(id)
        res.json({user})
    } catch (error) {
        console.log(error)
        res.json({error})
    }
}

export const updateOne=async(req: Request, res: Response)=>{
    try {
        const {id}=req.query
        const user=await User.findByIdAndUpdate(id,req.body)
        res.json({user})
    } catch (error) {
        console.log(error)
        res.json({error})
    }
}