import type { Request } from 'express';
import multer, { type FileFilterCallback, type StorageEngine } from 'multer';
import path from 'path';

// Multer Custom Storage
const storage: StorageEngine = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        // For localhost - store in public/temp folder
        cb(null, './public/temp');

        // For Vercel - use tmp folder
        // cb(null, "/tmp")
    },
    filename: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ) {
        const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename =
            file.fieldname +
            '-' +
            uniqueSuffix +
            path.extname(file.originalname);
        cb(null, filename);
        console.log('File saved as:', filename);
    }
});

// File filter for images and videos only
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
): void => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const videoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    const allowedTypes = [...imageTypes, ...videoTypes];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('INVALID_FILE_TYPE'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

export default upload;
