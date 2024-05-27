import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { FileFilter } from '../utils/file-uploads-utils';

export const multerConfig = {
  storage: diskStorage({
    destination: './public/uploads', //dossier de destination
    filename: (req, file, callback) => {
      const fileExtName = path.extname(file.originalname);
      const randomName = uuidv4();
      callback(null, `${randomName}${fileExtName}`);
    },
  }),
  fileFilter: FileFilter, // Utilise la fonction de filtrage des types de fichiers
  limits: { fileSize: 1024 * 1024 }, // Limite la taille des fichiers à 1Mo
};