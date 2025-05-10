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
  personalAccount:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'PersonalAccount'
  },
  merchantAccount:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'MerchantAccount'
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
