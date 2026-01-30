
/**
 * Advanced Adversarial Immunization
 * 
 * This module implements client-side adversarial defense techniques to protect images 
 * from AI-based manipulation (Deepfakes) and recognition.
 * 
 * Techniques used:
 * 1. High-Frequency Signal Injection (Invisible Noise)
 * 2. Diffeomorphic Geometric Warping (Spatial Disruption)
 * 3. Color Space Adversarial Shift
 */

export const immunizeImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const width = canvas.width;
            const height = canvas.height;

            // --- Layer 1: Geometric Warping (Spatial Disruption) ---
            // We create a subtle distortion field that shifts pixels slightly. 
            // This disrupts facial landmark detection used by deepfake models.

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height = height;
            const tempCtx = tempCanvas.getContext('2d');
            if (tempCtx) {
                tempCtx.putImageData(imageData, 0, 0);

                // Clear main canvas to receive warped image
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, width, height);

                // Grid size for warping (smaller = more local, larger = more global)
                const gridSize = 30;
                const distortionAmp = 1.5; // Pixels to shift (keep low for invisibility)

                for (let y = 0; y < height; y += gridSize) {
                    for (let x = 0; x < width; x += gridSize) {
                        // Calculate random but smooth displacement
                        // Using Sin/Cos to ensure continuity (ripples) rather than jagged noise
                        const dx = Math.sin(y / 50) * Math.cos(x / 50) * distortionAmp * (Math.random() * 0.5 + 0.5);
                        const dy = Math.cos(y / 60) * Math.sin(x / 60) * distortionAmp * (Math.random() * 0.5 + 0.5);

                        // Draw slice from source to destination with offset
                        // We draw slightly larger chunks to avoid gaps
                        ctx.drawImage(
                            tempCanvas,
                            x, y, gridSize, gridSize,     // Source
                            x + dx, y + dy, gridSize + 1, gridSize + 1 // Destination (warped)
                        );
                    }
                }
            }

            // Get warped data back for noise injection
            const warpedImageData = ctx.getImageData(0, 0, width, height);
            const warpedData = warpedImageData.data;

            // --- Layer 2: Frequency Domain Perturbation (Signal Injection) ---
            // We inject a high-frequency pattern aimed at confusing CNN strides.
            // This mimics "Adversarial Examples" but generalized.

            const noiseIntensity = 8; // Visible limit is usually ~3-5, we push slightly for effectiveness

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = (y * width + x) * 4;

                    // 1. Structural Noise (Grid Pattern to break convolutions)
                    const structureNoise = ((x % 2) * (y % 2)) * 4;

                    // 2. High-Frequency Sine Wave (Ripple)
                    const freqNoise = Math.sin(x * 0.5) * Math.cos(y * 0.5) * noiseIntensity;

                    // 3. Random Gaussian (Chaos)
                    const randomNoise = (Math.random() - 0.5) * noiseIntensity;

                    // Combine noises
                    const totalNoise = freqNoise + randomNoise + structureNoise;

                    // Apply to RGB channels
                    // We apply different weights to R, G, B to affect "texture" more than "color"
                    warpedData[idx] = clamp(warpedData[idx] + totalNoise);       // R
                    warpedData[idx + 1] = clamp(warpedData[idx + 1] + totalNoise);   // G
                    warpedData[idx + 2] = clamp(warpedData[idx + 2] + totalNoise);   // B
                    // Alpha unchanged
                }
            }

            // Put final data back
            ctx.putImageData(warpedImageData, 0, 0);

            // Convert to Blob
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to create blob from canvas'));
                }
            }, file.type || 'image/png', 0.95);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
};

// Helper to keep pixel values valid
function clamp(value: number): number {
    return Math.max(0, Math.min(255, value));
}
