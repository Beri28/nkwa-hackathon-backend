import {Router} from 'express'
import { Login, Logout, Signup } from '../controller/auth.controller'
import { Request, Response, NextFunction } from 'express';

const authRouter = Router()
const test=(req:Request,res:Response)=>{
    try {
        res.send("Hello")
    } catch (error) {
        
    }
}
authRouter.post('/signup', Signup)
authRouter.post('/test', (req:Request,res:Response)=>{
    try {
        const options = {
            method: 'POST',
            headers: {'X-API-Key': process.env.API_KEY || "", 'Content-Type': 'application/json'},
            body: `{"amount":${req.body.amount},"phoneNumber":"237681256076"}`
        };
          
        fetch('https://api.pay.staging.mynkwa.com/disburse', options)
        .then(response => response.json())
        .then(response =>{ 
            console.log(response)
            res.json({message:response})
        })
        .catch(err => {
            console.error(err) 
            res.json({error:err})
            // throw Error("Payment test failed")
        });
        // res.json({message:"Success"})
    } catch (error) {
        console.log(error)
        res.json({error:error})
    }
})
authRouter.post('/login', Login)
authRouter.post('/logout', Logout)





export default authRouter