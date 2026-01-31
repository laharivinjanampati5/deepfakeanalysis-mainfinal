const AnalysisResult = require('../models/AnalysisResult');
const { analyzeDeepfakeML } = require('../services/mlService');

// In-memory store for No-DB mode
const memoryStore = new Map();

// Helper to handle both DB and Memory results
const findResult = async (id) => {
    try {
        return await AnalysisResult.findById(id);
    } catch (e) {
        return memoryStore.get(id);
    }
};

// @desc    Upload image/video for analysis
// @route   POST /api/analyze/upload
// @access  Private
const uploadForAnalysis = async (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }

    try {
        const userId = req.user ? req.user._id : '000000000000000000000000';
        const analysisId = require('crypto').randomBytes(12).toString('hex');

        console.log(`Starting analysis for file: ${req.file.path} (ID: ${analysisId})`);

        const analysisData = {
            _id: analysisId,
            user: userId,
            originalImage: `/${req.file.path.replace(/\\/g, '/')}`,
            type: req.file.mimetype.startsWith('video') ? 'video_deepfake' : 'deepfake',
            status: 'processing',
            createdAt: new Date()
        };

        let analysis;
        try {
            analysis = await AnalysisResult.create(analysisData);
        } catch (dbError) {
            console.warn('DB Error, using memory store fallback');
            analysis = { ...analysisData, save: async function () { memoryStore.set(this._id, this); } };
            memoryStore.set(analysisId, analysis);
        }

        // Trigger Async Processing
        analyzeDeepfakeML(req.file.path).then(async (result) => {
            console.log(`ML Analysis Result for ${analysisId}:`, result.status);
            analysis.status = result.status;
            analysis.isDeepfake = result.isDeepfake;
            analysis.confidence = result.confidence;
            analysis.analysisData = result.analysisData;
            await analysis.save();
        });

        res.status(201).json({
            message: 'File uploaded, analysis started',
            analysisId: analysisId
        });

    } catch (error) {
        console.error('Upload controller error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get analysis result
// @route   GET /api/analyze/:id
// @access  Private
const getAnalysisResult = async (req, res) => {
    const analysis = await findResult(req.params.id);

    if (analysis) {
        // Ensure user owns this analysis (Skip for guest mode 000...000 or No-DB memory mode)
        if (req.user && analysis.user && analysis.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        res.json(analysis);
    } else {
        res.status(404).json({ message: 'Analysis not found' });
    }
};

module.exports = {
    uploadForAnalysis,
    getAnalysisResult
};
