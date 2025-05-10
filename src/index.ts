import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors'
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import mongoose from 'mongoose';
import paymentRouter from './routes/payment.route';

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(cors({
  origin:'http://localhost:5173',
}))
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('/frontend/public'))
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('*',(req,res)=>{
  res.sendFile('index.html',{root:'./frontend/dist'})
})

app.listen(port, async () => {
  console.log(`Server is Fire at http://localhost:${port}`);
  try {
      await mongoose.connect(process.env.DATABASE_URL || '');
      console.log('Connected to MongoDB');
  } catch (error) {
      console.error(error);
      process.exit(1);
  }
});
// "dev": " ts-node-dev --respawn --transpile-only src/server.ts"
