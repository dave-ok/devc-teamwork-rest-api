import jwt from 'jsonwebtoken';
import User from './../models/user.model';
import bcrypt from 'bcrypt';
import { handleResponse } from '../../utils/responseHandler';

const generateToken = (userId, firstName, email, gender) => {
    
    const secretPhrase = Buffer.from(process.env.JWT_SECRET || 'our little secret', 'base64');
    const token = jwt.sign({userId, firstName, email, gender}, secretPhrase);

    return token;
}

const hashPassword = async (password) => {
    console.log(`password: ${password}`);
   const hash = await bcrypt.hash(password, 10);
   return hash;
}

const authCtrl = {
    createUser: async (req, res, next) => {
        let hashedPassword = '';
        try {
            hashedPassword = await hashPassword(req.body.password);            
        } catch (error) {
            console.log(`error hashing password: ${error.message}`);
            return next(error);  
        }
        
        try {
            //create new user using req params
            const user = new User();
            user.first_name = req.body.firstName;
            user.last_name = req.body.lastName;
            user.email = req.body.email;
            user.password = hashedPassword;
            user.gender = req.body.gender;
            user.department = req.body.department;
            user.job_role = req.body.jobRole;
            user.address = req.body.address;
            await user.save();

            const token = generateToken(user.user_id, user.first_name, user.email, user.gender);

            handleResponse(res, 201, {
                message: 'User account succesfully created',
                userId: user.user_id,
                token: token
            });

        }
        catch (error)
        {
            console.log(`error creating user: ${error.message}`);
            return next(error);
        }
        
    },

    signIn: (req, res, next) => {
        res.send('signing in');
    }

}

export default authCtrl;