import mongoose from 'mongoose';

const merchantAccount = new mongoose.Schema({
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
  paymentsReceived:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Payment'
  }],
}, { timestamps: true });

const MerchantAccount = mongoose.model('MerchantAccount', merchantAccount);
export default MerchantAccount;
