// middlewares/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const tmpDir = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

export const upload = multer({
    storage: multer.diskStorage({
        destination: (_, __, cb) => cb(null, tmpDir),
        filename: (_, file, cb) => {
            const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            cb(null, `${file.fieldname}-${unique}${ext}`);
        }
    })
}).array('images', 5);
