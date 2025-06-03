// src/routes/api/images.ts

import express, { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import multer from 'multer';

const imagerouter = express.Router();

// Directories
const uploadDir: string = path.join(__dirname, '../assets/images/uploads');
const outputDir: string = path.join(__dirname, '../assets/images/outputs');


// Ensure upload directory exists (on app start)
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

const upload = multer({ dest: uploadDir });

// Extend Request to include typed fields
interface ResizeRequest extends Request {
  file?: Express.Multer.File;
  body: {
    width: string;
    height: string;
  };
}

// Exported image processing function (testable independently)
export async function processImage(
  sourcePath: string,
  width: number,
  height: number,
  outputPath: string
): Promise<void> {
  if (width <= 0 || height <= 0 || isNaN(width) || isNaN(height)) {
    throw new Error('Invalid dimensions: width and height must be positive numbers.');
  }

  try {
    await sharp(sourcePath)
      .resize(width, height)
      .toFile(outputPath);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error processing image: ${error.message}`);
    } else {
      throw new Error('Error processing image: Unknown error');
    }
  }
}

// POST /api/images/upload – handles upload and resizing
imagerouter.post(
  '/upload',
  upload.single('image'),
  async (req: ResizeRequest, res: Response): Promise<void> => {
    const { width, height } = req.body;
    const file = req.file;

    // Validate required inputs
    if (!file || !width || !height) {
      res.status(400).send('Missing data');
      return;
    }

    const parsedWidth = parseInt(width, 10);
    const parsedHeight = parseInt(height, 10);

    const name = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    const filename = `${name}_${parsedWidth}x${parsedHeight}${ext}`;
    const outputPath = path.join(outputDir, filename);

    try {
      // Ensure output directory exists before use
      await fs.mkdir(outputDir, { recursive: true });

      // Check if image already exists (cache)
      await fs.access(outputPath);
      res.sendFile(outputPath);
      return;
    } catch {
      // Output file doesn't exist, continue to process
    }

    try {
      await processImage(file.path, parsedWidth, parsedHeight, outputPath);
      await fs.unlink(file.path); // Clean up uploaded original
      res.sendFile(outputPath);
    } catch (error) {
      console.error('Image processing error:', error);
      res.status(500).send('Error processing image');
    }
  }
);

// Export router
export default imagerouter;
