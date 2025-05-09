"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logout = exports.Login = exports.Signup = exports.sendResponse = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendResponse = (res, statusCode, message, data) => {
    res.status(statusCode).json({
        status: "Success",
        message,
        results: data ? data.length : undefined,
        data,
    });
};
exports.sendResponse = sendResponse;
const Signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // export const Signup = async (req, res, next) => {
    try {
        console.log("Signup request received:", req.body); // Log incoming request data
        const { name, telephone, email, password, role } = req.body;
        // Check if all required fields are provided
        if (!name || !telephone || !email || !password) {
            console.error("Signup failed: Missing required fields");
            res.json({ message: "All fields are required" });
            return;
        }
        console.log("Checking if user already exists...");
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            console.warn("Signup failed: User already exists");
            res.status(400).json({ message: "User already exists" });
            return;
        }
        console.log("Generating salt for password hashing...");
        const salt = yield bcryptjs_1.default.genSalt(10);
        console.log("Hashing password...");
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        console.log("Password hashed successfully");
        console.log("Creating new user...");
        const newUser = yield user_model_1.default.create({
            name,
            telephone,
            email,
            password: hashedPassword,
            role: role || 'user' // Default role to 'user' if not provided
        });
        console.log("User created successfully:", newUser);
        console.log("Generating JWT token...");
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, process.env.JWT_SECRET || " ");
        console.log("Signup successful. Responding with token and user data...");
        res.status(201).json({
            success: true,
            message: `${name} created successfully`,
            data: { token, user: newUser }
        });
    }
    catch (error) {
        console.error("Error during Signup:", error.message);
        next(error);
    }
});
exports.Signup = Signup;
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || '');
        res.status(200).json({ success: true, message: `Welcome back ${user.name}`, data: { token, user } });
    }
    catch (error) {
        next(error);
    }
});
exports.Login = Login;
const Logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // export const Logout = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, message: 'Logged out successfully' });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.Logout = Logout;
