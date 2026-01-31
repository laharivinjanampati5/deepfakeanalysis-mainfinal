const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

class AIorNotDetector {
    /**
     * Client for AI or Not API.
     * @param {string} apiKey - The API key for authentication.
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.endpoint = 'https://api.aiornot.com/v2/image/sync';
    }

    /**
     * Detect if an image is AI-generated.
     * @param {string} imagePath - Path to the image file.
     * @param {string|null} externalId - Optional tracking ID.
     * @returns {Promise<object>} - Detection results.
     */
    async detect(imagePath, externalId = null) {
        if (!fs.existsSync(imagePath)) {
            return { error: `File not found: ${imagePath}` };
        }

        try {
            const form = new FormData();
            form.append('image', fs.createReadStream(imagePath));

            const params = {};
            if (externalId) {
                params.external_id = externalId;
            }

            const response = await axios.post(this.endpoint, form, {
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Bearer ${this.apiKey}`,
                },
                params,
                timeout: 30000,
            });

            return response.data;
        } catch (error) {
            if (error.response) {
                return { error: `Request error: ${error.message}`, details: error.response.data };
            } else {
                return { error: `Unexpected error: ${error.message}` };
            }
        }
    }
}

// Instantiate with provided key
const detector = new AIorNotDetector(process.env.AIORNOT_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJhYjQ0NDFhLTg1MjktNDEwYy1hMDNkLTM3NDYzNDIzYTUxNyIsInVzZXJfaWQiOiI5NDM4NzEwMi02YTQ2LTQ2ZTktYWM2OS1mMWU4OTZkNGJlNjQiLCJhdWQiOiJhY2Nlc3MiLCJleHAiOjE5Mjc0OTgxMzYsInNjb3BlIjoiYWxsIn0.25ts6NAPm7tqeVeYjbqwp2MOGb-b07-43SiL3z48R84');

module.exports = detector;
