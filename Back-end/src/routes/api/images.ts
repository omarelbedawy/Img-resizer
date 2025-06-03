// src/routes/api/images.ts
import express, { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises'; // Use fs.promises for async operations
import multer from 'multer';

const imagerouter = express.Router();

// Define the directory where uploaded files will be stored
const uploadDir: string = path.join(__dirname, '../../assets/images/uploads');
const upload = multer({ dest: uploadDir });

// Extend the Request type to include multer file and body fields for resize
interface ResizeRequest extends Request {
    file?: Express.Multer.File;
    body: {
        width: string;
        height: string;
    };
}

// --- NEW: Exported function for image processing ---
// This function encapsulates the core image resizing logic using sharp.
// It's exported so it can be directly tested by indexspec.ts.
export async function processImage(
    sourcePath: string,
    width: number,
    height: number,
    outputPath: string
): Promise<void> {
    // Add robust validation for dimensions here if not done upstream
    if (width <= 0 || height <= 0 || isNaN(width) || isNaN(height)) {
        throw new Error('Invalid dimensions: width and height must be positive numbers.');
    }

    try {
        await sharp(sourcePath)
            .resize(width, height)
            .toFile(outputPath);
    } catch (error: unknown) {
        // Re-throw with a more generic message or specific error type
        // This helps in testing by providing a consistent error message.
        if (error instanceof Error) {
            throw new Error(`Error processing image: ${error.message}`);
        } else {
            throw new Error('Error processing image: Unknown error');
        }
    }
}
// --- END NEW ---

// POST route to handle image upload and resizing
imagerouter.post(
    '/upload',
    upload.single('image'), // Accept a single file upload with field name 'image'
    async (req: ResizeRequest, res: Response): Promise<void> => {
        const { width, height } = req.body;
        const file = req.file;

        // Validate required inputs
        if (!file || !width || !height) {
            res.status(400).send('Missing data');
            return;
        }

        // Parse dimensions to numbers
        const parsedWidth = parseInt(width, 10);
        const parsedHeight = parseInt(height, 10);

        // Construct the output filename and path
        const name = path.parse(file.originalname).name;
        const ext = path.extname(file.originalname);
        // Corrected filename string literal syntax
        const filename = `${name}_${parsedWidth}x${parsedHeight}${ext}`;
        const outputPath: string = path.join(
            __dirname,
            '../../assets/images/outputs',
            filename
        );

        // If the resized image already exists, send it directly
        try {
            await fs.access(outputPath); // Check if file exists asynchronously
            res.sendFile(outputPath);
            return;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            // File does not exist, proceed to process
        }

        try {
            // Use the new exported function for processing
            await processImage(file.path, parsedWidth, parsedHeight, outputPath);

            // Delete the original uploaded file after processing
            await fs.unlink(file.path); // Use async unlink

            // Send the resized image as the response
            res.sendFile(outputPath);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error processing image');
        }
    }
);

// Export the router for use in the main app
export default imagerouter;
