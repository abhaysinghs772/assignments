import multer from 'multer';
import path from 'path'; 

const __dirname = path.resolve();

const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //     cb(null, path.join(__dirname, 'src/merged/'))
    // },
    // filename: function (req, file, cb) {
    //     cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0])
    // }
});

// Configure multer
const multi_upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .pdf format allowed!');
            err.name = 'ExtensionError';
            return cb(err);
        }
    },
}).array('files', 10);

export default multi_upload;