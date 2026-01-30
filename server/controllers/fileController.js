
const path = require('path');

// @desc    Download file
// @route   GET /api/upload/download/:filename
// @access  Private (Optional: Public if shared)
const downloadFile = (req, res) => {
    const filename = req.params.filename;
    // Security check: exclude directory traversal
    if (filename.includes('..')) {
        res.status(400).send('Invalid filename');
        return;
    }

    const filePath = path.join(__dirname, '../uploads', filename);

    res.download(filePath, filename, (err) => {
        if (err) {
            if (!res.headersSent) {
                res.status(404).send('File not found');
            }
        }
    });
};

module.exports = { downloadFile };
