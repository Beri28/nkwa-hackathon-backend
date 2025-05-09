import { Request, Response, NextFunction } from 'express';
import User from '../model/user.model';
import Payment from '../model/payment.model';
import Withdraw from '../model/withdraw.model';

export const Transfer=async (req: Request, res: Response)=>{
    try {
        const {senderId,receiverId,amount,paymentChannel,status}=req.body
        const transaction=await Payment.create({
            senderId,
            receiverId,
            amount,
            paymentChannel,
            status
        })
        const senderUser=await User.findByIdAndUpdate(senderId,{
            $inc:{balance:-amount},
            $addToSet:{paymentsMade:transaction._id}
        })
        const receiverUser=await User.findByIdAndUpdate(receiverId,{
            $inc:{balance:amount},
            $addToSet:{paymentsReceived:transaction._id}
        })
        const transaction2=await Payment.findByIdAndUpdate(transaction._id,{
            status:'success'
        })
        res.json({transaction2})
    } catch (error) {
        console.log(error)
        res.json({error})
    }
}

export const WithdrawMoney=async (req: Request, res: Response)=>{
    const {id,phoneNumber,amount,withdrawChannel,status}=req.body
    try {
        const transaction=await Withdraw.create({
            userId:id,
            phoneNumber,
            amount,
            withdrawChannel,
            status
        })
        const updatedUser=await User.findByIdAndUpdate(id,{
            $inc:{balance:-amount},
            $addToSet:{withdrawalsMade:transaction._id}
        })
        const transaction2=await Withdraw.findByIdAndUpdate(transaction._id,{
            status:'success'
        })
        res.json({transaction2})
    } catch (error) {
        console.log(error)
        // const transaction2=await Withdraw.findOneAndDelete({userId:id},{
        //     status:'failed'
        // })
        res.json({error})
    }
}