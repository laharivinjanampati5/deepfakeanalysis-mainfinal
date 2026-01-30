
const express = require('express');
const router = express.Router();
const { downloadFile } = require('../controllers/fileController');

router.get('/download/:filename', downloadFile);

module.exports = router;
