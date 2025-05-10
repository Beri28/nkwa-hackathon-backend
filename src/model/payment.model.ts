import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  receiverModel:{
    type:String,
    required:true,
    enum:['MerchantAccount','PersonalAccount'],
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'PersonalAccount',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    refPath:'receiverModel', 
  },
  date:{
    type:Date,
    default:new Date(Date.now()),
    required:true
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentChannel: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum:['pending','success','failed'],
    default:'pending',
    required: true,
  },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
