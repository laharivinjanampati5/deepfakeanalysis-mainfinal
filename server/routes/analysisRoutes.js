
const express = require('express');
const router = express.Router();
const { uploadForAnalysis, getAnalysisResult } = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', upload.single('file'), uploadForAnalysis);
router.get('/:id', getAnalysisResult);

module.exports = router;
