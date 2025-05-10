import User from '../model/user.model';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import PersonalAccount from '../model/personalAccount.model';

const Prisma=new PrismaClient()
 
export const Signup = async (req: Request, res: Response, next: NextFunction)=> {
// export const Signup = async (req, res, next) => {
    try {
        console.log("Signup request received:", req.body);  // Log incoming request data

        const { username, phoneNumber, password } = req.body;

        // Check if all required fields are provided
        if (!phoneNumber || !password) {
            console.error("Signup failed: Missing required fields");
            res.json({ message: "All fields are required" });
            return
        }

        console.log("Checking if user already exists...");
        const existingUser = await User.findOne({ phoneNumber })
        // const existingUser = await Prisma.user.findUnique({
        //     where:{email}
        // });
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
            phoneNumber,
            password: hashedPassword,
        });
        const newPersonalAccount=await PersonalAccount.create({
            userId:newUser._id
        })
        newUser.personalAccount=newPersonalAccount._id
        let updatedNewUser= await User.findByIdAndUpdate(newUser._id,{
            personalAccount:newPersonalAccount._id
        },{new:true}).populate('personalAccount')

        console.log("User created successfully:", updatedNewUser);

        console.log("Generating JWT token...");
        const token = jwt.sign(
            { id: newUser.id },
            process.env.JWT_SECRET || " ",
            // { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        console.log("Signup successful. Responding with token and user data...");
        res.status(201).json({
            success: true,
            message: `${username} created successfully`,
            data: { token, user: updatedNewUser }
        });

    } catch (error:any) {
        console.error("Error during Signup:", error.message);
        next(error);
    }
};
export const Login = async (req: Request, res: Response, next: NextFunction) => {
// export const Login = async (req, res, next) => {
    try {
        const { phoneNumber, password } = req.body;
        const user = await User.findOne({ phoneNumber }).populate('personalAccount').populate('merchantAccount');
        // const user = await Prisma.user.findUnique({ where:{email} });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }
 
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return
        }

        const token = jwt.sign({ id: user.phoneNumber }, process.env.JWT_SECRET || '');

        res.status(200).json({ success: true, message: `Welcome back ${user.username}`, data: { token, user } });
    } catch (error) {
        
        next(error);
    }
}
export const Logout = async (req: Request, res: Response, next: NextFunction) => {
// export const Logout = async (req, res, next) => {
        try {
            res.status(200).json({ success: true, message: 'Logged out successfully' });
            return
        } catch (error) {
            next(error);
        }
};
