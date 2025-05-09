import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  // telephone: {
  //   type: String,
  //   required: true,
  // },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  balance:{
   type:Number 
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

const User = mongoose.model('User', userSchema);
export default User;
