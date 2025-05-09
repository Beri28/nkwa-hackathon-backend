import mongoose from 'mongoose';

const withdrawSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
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
