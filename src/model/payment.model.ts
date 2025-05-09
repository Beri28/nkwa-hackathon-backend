import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User', 
    required: true,
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
