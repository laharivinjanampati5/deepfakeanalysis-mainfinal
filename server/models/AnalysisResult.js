
const mongoose = require('mongoose');

const analysisResultSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    originalImage: {
        type: String, // Path or URL
        required: true,
    },
    processedImage: {
        type: String, // Path or URL (if immunization)
    },
    type: {
        type: String,
        enum: ['deepfake', 'immunization', 'video_deepfake'],
        required: true,
    },
    status: {
        type: String,
        enum: ['processing', 'completed', 'failed'],
        default: 'processing',
    },
    confidence: {
        type: Number,
        default: 0,
    },
    isDeepfake: {
        type: Boolean,
        default: false
    },
    analysisData: {
        type: Object, // Flexible object for storing detailed metrics (spatial, temporal, etc.)
    },
}, {
    timestamps: true,
});

const AnalysisResult = mongoose.model('AnalysisResult', analysisResultSchema);
module.exports = AnalysisResult;
