const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single('video');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/video.html'));
});

router.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(500).json({ msg: 'File upload failed' });
        } else {
            res.status(200).json({ msg: 'File uploaded successfully' });
        }
    });
});

module.exports = router;
