import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { Transfer, WithdrawMoney } from '../controller/payment.controller';


const paymentRouter = Router();

paymentRouter.get('/payment-details',(req:Request,res:Response)=>{
    try {
        const options = {method: 'GET', headers: {'X-API-Key': process.env.API_KEY || ""}};
        const {id}=req.query
        console.log(id,req.query)
        fetch('https://api.pay.staging.mynkwa.com/payments/'+id, options)
        .then(response => response.json())
        .then(response => { 
            console.log(response)
            res.json({message:response})
        })
        .catch(err => {
            console.error(err) 
            res.json({error:err})
            // throw Error("Payment test failed")
        });
    } catch (error) {
        console.log(error)
        res.json({error:error})
    }
})

paymentRouter.post('/disburse',(req:Request,res:Response)=>{
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

paymentRouter.post('/pay',(req:Request,res:Response)=>{
    try {
        const options = {
            method: 'POST',
            headers: {'X-API-Key': process.env.API_KEY || "", 'Content-Type': 'application/json'},
            body: `{"amount":${req.body.amount},"phoneNumber":"237681256076"}`
        };
          
        fetch('https://api.pay.staging.mynkwa.com/collect', options)
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

paymentRouter.post('/transfer',Transfer)
paymentRouter.post('/withdraw',WithdrawMoney)


export default paymentRouter;