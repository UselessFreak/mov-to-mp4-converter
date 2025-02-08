const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const VideoConverter = require('../services/converter.service');
const fs = require('fs-extra');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'video/quicktime') {
            cb(null, true);
        } else {
            cb(new Error('Only .mov files are allowed!'), false);
        }
    }
}).single('video');

router.post('/upload', (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    error: 'File is too large. Maximum size is 1GB'
                });
            }
            return res.status(400).json({
                success: false,
                error: `Upload error: ${err.message}`
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Please select a video file'
            });
        }

        try {
            const outputFileName = `${path.parse(req.file.filename).name}.mp4`;
            const convertedPath = await VideoConverter.convertToMp4(req.file.path, outputFileName);

            res.json({
                success: true,
                message: 'Video converted successfully',
                downloadUrl: `/api/download/${path.basename(convertedPath)}`
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: `Conversion error: ${error.message}`
            });
        }
    });
});

router.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../../converted', req.params.filename);
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ 
            success: false,
            error: 'File not found' 
        });
    }

    res.download(filePath, (err) => {
        if (!err) {
            fs.removeSync(filePath);
        }
    });
});

router.get('/progress', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const converter = VideoConverter.getEmitter();
    
    converter.on('progress', (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    });

    req.on('close', () => {
        converter.removeAllListeners('progress');
    });
});

module.exports = router;
