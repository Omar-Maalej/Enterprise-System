import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

type validFileExtension = 'pdf' | 'docx' | 'doc' | 'xls' | 'xlsx';
type validMimeType =
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const validFileExtensions: validFileExtension[] = [
  'pdf',
  'docx',
  'xlsx',
  'xls',
  'doc',
];
const validMimeTypes: validMimeType[] = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const saveDocumentToStorage = {
  storage: diskStorage({
    destination: './public/uploads/documents',
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
