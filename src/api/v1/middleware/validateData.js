import { validationResult } from "express-validator"
import CustomError from "../../utils/customError";

const validateData = (req, res, next) => {    
    const errors = validationResult (req);

    if (errors.isEmpty()) {
        return next();
    }
    const errorsArray = [];
    errors.array().map(error => errorsArray.push({ [error.param]: error.msg }))
    
    return next(new CustomError(422, errorsArray));
     
}

export default validateData;