import express from 'express';
import authCtrl from '../../controllers/authController';
import { createUpdateUserRule } from '../../middleware/validationRules';
import validateData from '../../middleware/validateData';


const authRouter = express.Router();

authRouter.post(
  '/create-user',
  createUpdateUserRule(),
  validateData,
  authCtrl.createUser,
);

authRouter.post('/signin', authCtrl.signIn);

export default authRouter;
