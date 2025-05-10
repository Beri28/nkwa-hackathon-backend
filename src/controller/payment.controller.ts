import { Request, Response, NextFunction } from 'express';
import User from '../model/user.model';
import Payment from '../model/payment.model';
import Withdraw from '../model/withdraw.model';
import MerchantAccount from '../model/merchantAccount.model';
import PersonalAccount from '../model/personalAccount.model';

export const AllPersonalTransfers=async (req: Request, res: Response)=>{
    try {
        const {id}=req.query
        const transactions=await Payment.find({senderId:id}).populate('receiver')
        res.json({allPersonalTransfers:transactions})
    } catch (error) {
        console.log(error)
        res.json({error})
    }
}

export const AllReceivedMerchant=async (req: Request, res: Response)=>{
    try {
        const {id}=req.query
        const transactions=await Payment.find({receiver:id}).populate('sender')
        res.json({allReceived:transactions})
    } catch (error) {
        console.log(error)
        res.json({error})
    }
}

export const AllReceivedPersonal=async (req: Request, res: Response)=>{
    try {
        const {id}=req.query
        const transactions=await Payment.find({receiver:id}).populate('sender')
        res.json({allReceived:transactions})
    } catch (error) {
        console.log(error)
        res.json({error})
    }
}

export const AllWithdraws=async (req: Request, res: Response)=>{
    try {
        const {id}=req.query
        const transactions=await Withdraw.find({receiver:id})
        res.json({allWithdraws:transactions})
    } catch (error) {
        console.log(error)
        res.json({error})
    }
}

export const TransferPersonal=async (req: Request, res: Response)=>{
    try {
        const {senderId,receiverId,amount,paymentChannel,status}=req.body
        const personal=await PersonalAccount.findById(senderId)
        if(personal && personal?.balance>=amount){
            const transaction=await Payment.create({
                sender:senderId,
                receiver:receiverId,
                receiverModel:'PersonalAccount',
                amount,
                paymentChannel,
                status
            })
            const senderUser=await PersonalAccount.findByIdAndUpdate(senderId,{
                $inc:{balance:-amount},
                $addToSet:{paymentsMade:transaction._id}
            })
            const receiverUser=await PersonalAccount.findByIdAndUpdate(receiverId,{
                $inc:{balance:amount},
                $addToSet:{paymentsReceived:transaction._id}
            })
            const transaction2=await Payment.findByIdAndUpdate(transaction._id,{
                status:'success'
            })
            res.json({transaction2})
        }else{
            // throw new Error("Insufficient balance")
            res.json({error:"Insufficient balance"})
        }
    } catch (error) {
        console.log(error)
        res.json({error})
    }
}

export const TransferMerchant=async (req: Request, res: Response)=>{
    try {
        const {senderId,receiverId,amount,paymentChannel,status}=req.body
        const personal=await MerchantAccount.findById(senderId)
        if(personal && personal?.balance>=amount){
            const transaction=await Payment.create({
                sender:senderId,
                receiver:receiverId,
                receiverModel:'MerchantAccount',
                amount,
                paymentChannel,
                status
            })
            const senderUser=await PersonalAccount.findByIdAndUpdate(senderId,{
                $inc:{balance:-amount},
                $addToSet:{paymentsMade:transaction._id}
            })
            const receiverUser=await MerchantAccount.findByIdAndUpdate(receiverId,{
                $inc:{balance:amount},
                $addToSet:{paymentsReceived:transaction._id}
            })
            const transaction2=await Payment.findByIdAndUpdate(transaction._id,{
                status:'success'
            })
            res.json({transaction2})
        }else{
            // throw new Error("Insufficient balance")
            res.json({error:"Insufficient balance"})
        }
    } catch (error) {
        console.log(error)
        res.json({error})
    }
}

export const WithdrawPersonalMoney=async (req: Request, res: Response)=>{
    const {id,phoneNumber,amount,withdrawChannel,status}=req.body
    try {
        const personal=await PersonalAccount.findById(id)
        if(personal && personal?.balance >=amount){
            const transaction=await Withdraw.create({
                receiver:id,
                phoneNumber,
                amount,
                withdrawChannel,
                status
            })
            const updatedUser=await PersonalAccount.findByIdAndUpdate(id,{
                $inc:{balance:-amount},
                $addToSet:{withdrawalsMade:transaction._id}
            })
            const transaction2=await Withdraw.findByIdAndUpdate(transaction._id,{
                status:'success'
            })
            res.json({transaction2})
        }else{
            // throw new Error("Insufficient balance")
            res.json({error:"Insufficient balance"})
        }
    } catch (error) {
        console.log(error)
        // const transaction2=await Withdraw.findOneAndDelete({userId:id},{
        //     status:'failed'
        // })
        res.json({error})
    }
}

export const WithdrawMerchantMoney=async (req: Request, res: Response)=>{
    const {id,phoneNumber,amount,withdrawChannel,status}=req.body
    try {
        const merchant=await MerchantAccount.findById(id)
        if(merchant && merchant?.balance >=amount){
            const transaction=await Withdraw.create({
                receiver:id,
                phoneNumber,
                amount,
                withdrawChannel,
                status
            })
            const updatedUser=await MerchantAccount.findByIdAndUpdate(id,{
                $inc:{balance:-amount},
                $addToSet:{withdrawalsMade:transaction._id}
            })
            const transaction2=await Withdraw.findByIdAndUpdate(transaction._id,{
                status:'success'
            })
            res.json({transaction2})
        }else{
            // throw new Error("Insufficient balance")
            res.json({error:"Insufficient balance"})
        }
    } catch (error) {
        console.log(error)
        // const transaction2=await Withdraw.findOneAndDelete({userId:id},{
        //     status:'failed'
        // })
        res.json({error})
    }
}