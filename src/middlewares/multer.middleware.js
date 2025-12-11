import multer from 'multer';
import path from 'path';

// Multer Custom Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // For localhost - store in public/temp folder
        cb(null, './public/temp');

        // For Vercel - use tmp folder
        // cb(null, "/tmp")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename =
            file.fieldname +
            '-' +
            uniqueSuffix +
            path.extname(file.originalname);
        cb(null, filename);
    }
});

// File filter for images and videos only
const fileFilter = (req, file, cb) => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const videoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    // const allowedTypes = [...imageTypes, ...videoTypes];
    const allowedTypes = [...imageTypes];

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
