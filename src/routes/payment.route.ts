import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { AllPersonalTransfers, AllWithdraws, WithdrawPersonalMoney, WithdrawMerchantMoney, TransferPersonal, TransferMerchant, AllReceivedMerchant, AllReceivedPersonal, TransferMobile } from '../controller/payment.controller';
import User from '../model/user.model';
import PersonalAccount from '../model/personalAccount.model';
import MerchantAccount from '../model/merchantAccount.model';
import { disburse } from '../controller/nkwaPay.controller';


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
        const {phoneNumber,amount}=req.body
        const options = {
            method: 'POST',
            headers: {'X-API-Key': process.env.API_KEY || "", 'Content-Type': 'application/json'},
            body: `{"amount":${req.body.amount},"phoneNumber":${phoneNumber}}`
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
        const {phoneNumber,amount}=req.body
        const options = {
            method: 'POST',
            headers: {'X-API-Key': process.env.API_KEY || "", 'Content-Type': 'application/json'},
            body: `{"amount":${req.body.amount},"phoneNumber":${phoneNumber}}`
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

paymentRouter.post('/top-up/personal',(req:Request,res:Response)=>{
    try {
        const {id,phoneNumber,amount}=req.body
        console.log(req.body)
        const options = {
            method: 'POST',
            headers: {'X-API-Key': process.env.API_KEY || "", 'Content-Type': 'application/json'},
            body: `{"amount":${amount},"phoneNumber":${phoneNumber}}`
        };
          
        fetch('https://api.pay.staging.mynkwa.com/collect', options)
        .then(response => response.json())
        .then(async (response) =>{ 
            console.log(response)
            const user=await PersonalAccount.findByIdAndUpdate(id,{
                $inc:{balance:amount}
            },{new:true})
            res.json({message:user})
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

paymentRouter.post('/top-up/merchant',(req:Request,res:Response)=>{
    try {
        const {id,phoneNumber,amount}=req.body
        const options = {
            method: 'POST',
            headers: {'X-API-Key': process.env.API_KEY || "", 'Content-Type': 'application/json'},
            body: `{"amount":${amount},"phoneNumber":${phoneNumber}}`
        };
          
        fetch('https://api.pay.staging.mynkwa.com/collect', options)
        .then(response => response.json())
        .then(async (response) =>{ 
            console.log(response)
            const user=await MerchantAccount.findByIdAndUpdate(id,{
                balance:amount
            })
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

paymentRouter.get('/transfers/personal',AllPersonalTransfers)

paymentRouter.get('/withdraws',AllWithdraws)

paymentRouter.get('/received/merchant',AllReceivedMerchant)

paymentRouter.get('/received/personal',AllReceivedPersonal)

paymentRouter.post('/transfer/personal',TransferPersonal)

paymentRouter.post('/mobile',TransferMobile)

paymentRouter.post('/transfer/merchant',TransferMerchant)

paymentRouter.post('/withdraw/merchant',disburse,WithdrawMerchantMoney)

paymentRouter.post('/withdraw/personal',disburse,WithdrawPersonalMoney)


export default paymentRouter;