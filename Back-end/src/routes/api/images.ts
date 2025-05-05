import express, { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
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

    // Construct the output filename and path
    const name = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    const filename = `${name}_${width}x${height}${ext}`;
    const outputPath: string = path.join(
      __dirname,
      '../../assets/images/outputs',
      filename
    );

    // If the resized image already exists, send it directly
    if (fs.existsSync(outputPath)) {
      res.sendFile(outputPath);
      return;
    }

    try {
      // Resize and save the image using Sharp
      await sharp(file.path)
        .resize(parseInt(width, 10), parseInt(height, 10))
        .toFile(outputPath);

      // Delete the original uploaded file after processing
      fs.unlinkSync(file.path);

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
