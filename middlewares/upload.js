import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Make sure the temp folder exists
const tmpDir = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, tmpDir),
    filename:    (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext    = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${unique}${ext}`);
    }
});

export const upload = multer({ storage }).array('images', 5);
