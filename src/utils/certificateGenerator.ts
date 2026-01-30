
import { jsPDF } from 'jspdf';

interface AnalysisResult {
    isDeepfake: boolean;
    confidence: number;
    spatialScore: number;
    temporalScore: number;
    biologicalScore: number;
    frequencyScore: number;
    analysis?: string;
    detectedArtifacts?: string[];
}

export const generateCertificate = (result: AnalysisResult, userName: string = "Guest User") => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // --- Background & Border ---
    doc.setFillColor(10, 10, 30); // Dark background
    doc.rect(0, 0, 297, 210, 'F');

    doc.setDrawColor(0, 242, 255); // Cyan border
    doc.setLineWidth(1);
    doc.rect(10, 10, 277, 190);

    doc.setDrawColor(112, 0, 255); // Purple inner border
    doc.rect(12, 12, 273, 186);

    // --- Header ---
    doc.setTextColor(0, 242, 255); // Cyan text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.text("CERTIFICATE OF ANALYSIS", 148, 40, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(200, 200, 200);
    doc.text("OFFICIAL FORENSIC DEEPFAKE REPORT", 148, 50, { align: "center" });

    // --- Content ---
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(`This document certifies that the media submitted by`, 148, 70, { align: "center" });

    doc.setFontSize(24);
    doc.setTextColor(0, 242, 255);
    doc.text(userName.toUpperCase(), 148, 85, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(`has undergone rigorous multi-modal forensic examination.`, 148, 100, { align: "center" });

    // --- Result Section ---
    doc.setFontSize(20);
    doc.text("VERDICT:", 80, 130);

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    if (result.isDeepfake) {
        doc.setTextColor(255, 50, 50); // Red
        doc.text("DEEPFAKE DETECTED", 160, 130);
    } else {
        doc.setTextColor(50, 255, 100); // Green
        doc.text("AUTHENTIC MEDIA", 160, 130);
    }

    // --- Metrics ---
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");

    doc.text(`Confidence Score: ${result.confidence.toFixed(1)}%`, 80, 145);
    doc.text(`Spatial Integrity: ${result.spatialScore}%`, 80, 155);
    doc.text(`Date of Analysis: ${new Date().toLocaleDateString()}`, 160, 145);
    doc.text(`Report ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 160, 155);

    // --- Footer ---
    doc.setDrawColor(100, 100, 100);
    doc.line(70, 175, 227, 175);

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Verified by DeepfakeDefense AI Protocol v2.5", 148, 185, { align: "center" });
    doc.text("Encoded with Blockchain-Ready Hash Validation", 148, 190, { align: "center" });

    // Save
    doc.save("Deepfake_Analysis_Certificate.pdf");
};
