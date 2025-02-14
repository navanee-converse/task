import { Request } from 'express';
import multer, { FileFilterCallback, StorageEngine } from 'multer';

const storage: StorageEngine = multer.memoryStorage();

const fileFilter: multer.Options['fileFilter'] = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const requiredMimeType = 'application/pdf';
  if (requiredMimeType === file.mimetype) cb(null, true);
  else cb(null, false);
};

export const upload = multer({ storage, fileFilter });
