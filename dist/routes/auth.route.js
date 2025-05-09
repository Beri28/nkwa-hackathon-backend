"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth.controller");
const authRouter = (0, express_1.Router)();
const test = (req, res) => {
    try {
        res.send("Hello");
    }
    catch (error) {
    }
};
authRouter.post('/signup', auth_controller_1.Signup);
authRouter.post('/login', auth_controller_1.Login);
authRouter.post('/logout', auth_controller_1.Logout);
exports.default = authRouter;
