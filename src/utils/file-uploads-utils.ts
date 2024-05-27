export const FileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
      return callback(new Error('Only images or pdf files are allowed!'), false);
    }
    callback(null, true);
  };