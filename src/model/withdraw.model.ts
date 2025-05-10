import mongoose from 'mongoose';

const withdrawSchema = new mongoose.Schema({
  receiverModel:{
    type:String,
    required:true,
    enum:['MerchantAccount','PersonalAccount'],
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
  phoneNumber:{
    type:Number,
    required:true
  },
  amount: {
    type: Number,
    required: true,
  },
  withdrawChannel: {
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

const Withdraw = mongoose.model('Withdraw', withdrawSchema);
export default Withdraw;
