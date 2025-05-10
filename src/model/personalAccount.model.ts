import mongoose from 'mongoose';

const personalAccount = new mongoose.Schema({
  userId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
  },
  balance:{
   type:Number ,
   default:0
  },
  withdrawalsMade:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Withdraw'
  }],
  paymentsMade:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Payment'
  }],
  paymentsReceived:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Payment'
  }],
}, { timestamps: true });

const PersonalAccount = mongoose.model('PersonalAccount', personalAccount);
export default PersonalAccount;
