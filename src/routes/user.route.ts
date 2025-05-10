import { Router } from 'express';
import { getOne, updateOne } from '../controller/user.controller';

const userRouter = Router();

userRouter.get('/user', getOne)
userRouter.patch('/user', updateOne)

export default userRouter;