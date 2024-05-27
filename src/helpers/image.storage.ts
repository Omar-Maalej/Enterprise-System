import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
const validMimeTypes: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

export const saveImageToStorage = {
  storage: diskStorage({
    destination: './public/uploads/images',
    filename: (req, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuid() + fileExtension;
      cb(null, fileName);
    },
  }),
  fileFilter: (req: any, file: any, cb: any) => {
    if (!file) {
      cb(null, true);
    } else {
      const allowedMimeTypes: validMimeType[] = validMimeTypes;
      allowedMimeTypes.includes(file.mimetype)
        ? cb(null, true)
        : cb(null, false);
    }
  },
};
