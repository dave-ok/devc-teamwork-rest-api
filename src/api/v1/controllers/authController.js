import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import handleResponse from '../../utils/responseHandler';
import CustomError from '../../utils/customError';

const generateToken = (userId, firstName, email, gender) => {
  const secretPhrase = Buffer.from(process.env.JWT_SECRET || 'our little secret', 'base64');
  const token = jwt.sign({
    userId, firstName, email, gender,
  }, secretPhrase);

  return token;
};

const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

const comparePassword = async (password, hashed) => {
  const isValid = await bcrypt.compare(password, hashed);
  return isValid;
};


// not very safe to use direct, use with caution, has no validation
// use with middleware instead
export const signupUser = async (userData) => {
  let hashedPassword = '';

  try {
    hashedPassword = await hashPassword(userData.password);
  } catch (error) {
    console.log(`error hashing password: ${error.message}`);
    throw error;
  }

  // create new user using req params
  const user = new User();
  user.first_name = userData.firstName;
  user.last_name = userData.lastName;
  user.email = userData.email;
  user.password = hashedPassword;
  user.gender = userData.gender;
  user.department = userData.department;
  user.job_role = userData.jobRole;
  user.address = userData.address;
  await user.save();

  user.token = generateToken(user.user_id, user.first_name, user.email, user.gender);

  return user;
};

const authCtrl = {
  createUser: async (req, res, next) => {
    try {
      const user = await signupUser(req.body);

      return handleResponse(res, 201, {
        message: 'User account succesfully created',
        userId: user.user_id,
        token: user.token,
      });
    } catch (error) {
      // console.log(`error creating user: ${error.message}`);
      if (error.message.indexOf('duplicate key') >= 0) {
        return next(new CustomError(409, 'Duplicate error: user already exists'));
      }

      return next(error);
    }
  },

  signIn: async (req, res, next) => {
    // check if user exists
    let user;
    try {
      const row = await User.getAll({ email: req.body.email }, ['user_id', 'password']);
      [user] = row;
    } catch (error) {
      // if user not exist return login error
      if (error.message.indexOf('not found') >= 0) {
        return next(new CustomError(401, 'Invalid username or password'));
      }

      return next(error);
    }

    // user exists compare password
    try {
      let passwordOk;
      try {
        passwordOk = await comparePassword(req.body.password, user.password);
      } catch (error) {
        return next(new CustomError(401, 'Invalid username or password'));
      }

      if (passwordOk) {
        // return token, userId and message
        const token = generateToken(
          user.user_id,
          user.first_name,
          user.email,
          user.password,
        );

        return handleResponse(res, 200, {
          userId: user.user_id,
          message: 'Login successful',
          token,
        });
      }

      return next(new CustomError(401, 'Invalid username or password'));
    } catch (error) {
      console.log(error.message);
      return next(error);
    }
  },

};

export default authCtrl;
