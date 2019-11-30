import cloudinary from 'cloudinary';
import multer from 'multer';
import cloudinaryStorage from 'multer-storage-cloudinary';
import CustomError from '../../utils/customError';

const storage = cloudinaryStorage({
  cloudinary,
  folder: process.env.CLOUDINARY_FOLDER,
  allowedFormats: ['gif'],
});

const multerStorage = multer({ storage });

const cloudinaryUploader = (fieldName) => {
  const multerMW = multerStorage.single(fieldName);
  return (req, res, next) => {
    try {
      multerMW(req, res, (err) => {
        if (err) {
          if (err.message.indexOf('file format') >= 0) {
            return next(new CustomError(422, 'Invalid file format. Only gif images allowed'));
          }
          return next(err);
        }
        return next();
      });
    } catch (error) {
      next(error);
    }
  };
};

export default cloudinaryUploader;
