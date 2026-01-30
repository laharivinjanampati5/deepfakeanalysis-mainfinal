
const AnalysisResult = require('../models/AnalysisResult');
const { analyzeDeepfakeML } = require('../services/mlService');

// @desc    Upload image/video for analysis
// @route   POST /api/analyze/upload
// @access  Private
const uploadForAnalysis = async (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }

    try {
        // Create initial record
        // Use a dummy Guest ID if no user is logged in (for prototype/demo)
        // In production, this would require a real user ID or a session ID
        const userId = req.user ? req.user._id : '000000000000000000000000';

        let analysis = await AnalysisResult.create({
            user: userId,
            originalImage: `/${req.file.path}`,
            type: req.file.mimetype.startsWith('video') ? 'video_deepfake' : 'deepfake',
            status: 'processing'
        });

        // Trigger Async Processing (Fire and forget, or wait if fast)
        // ideally we return immediately and client polls, but for simplicity we simulate async here
        analyzeDeepfakeML(req.file.path).then(async (result) => {
            analysis.status = result.status;
            analysis.isDeepfake = result.isDeepfake;
            analysis.confidence = result.confidence;
            analysis.analysisData = result.analysisData;
            await analysis.save();
        });

        res.status(201).json({
            message: 'File uploaded, analysis started',
            analysisId: analysis._id
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get analysis result
// @route   GET /api/analyze/:id
// @access  Private
const getAnalysisResult = async (req, res) => {
    const analysis = await AnalysisResult.findById(req.params.id);

    if (analysis) {
        // Ensure user owns this analysis (Skip for guest mode 000...000)
        if (req.user && analysis.user.toString() !== req.user._id.toString()) {
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
