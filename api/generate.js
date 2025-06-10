import { GoogleGenerativeAI } from '@google/generative-ai';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false, // Important for handling file uploads
    },
};

async function handleImagePrompt(imagePath, textPrompt) {
    // Implement logic to extract information from the image and combine with text
    // This might involve using other Google Cloud Vision API or similar services.
    // For this basic example, we'll just return a placeholder.
    return `Prompt based on image and text: [Details from image] + "${textPrompt}"`;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Form parsing error:', err);
            return res.status(500).json({ message: 'Error processing the request.' });
        }

        const { text } = fields;
        const imageFile = files.image;
        let generatedText = '';

        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            if (imageFile) {
                // Basic handling - in a real application, you'd process the image
                const imagePath = imageFile.filepath;
                generatedText = await handleImagePrompt(imagePath, text || '');
                fs.unlinkSync(imagePath); // Clean up temporary file
            } else if (text) {
                const result = await model.generateContent(text);
                const response = await result.response;
                generatedText = response.text();
            } else {
                return res.status(400).json({ message: 'Please provide text or an image.' });
            }

            res.status(200).json({ generatedText });

        } catch (error) {
            console.error('Gemini API Error:', error);
            res.status(500).json({ message: 'Failed to generate content.', error: error.message });
        }
    });
}
