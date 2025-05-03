import express from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const imagerouter = express.Router();
const uploadDir = path.join(__dirname, '../../assets/images/uploads');
const upload = multer({ dest: uploadDir });

imagerouter.post('/upload', upload.single('image'), async (req, res) => {
  const { width, height } = req.body;
  const file = req.file;
  if (!file || !width || !height) {
    res.status(400).send('Missing data');
    return;
  }

  const name = path.parse(file.originalname).name;
  const ext = path.extname(file.originalname);
  const filename = `${name}_${width}x${height}${ext}`;
  const outputPath = path.join(
    __dirname,
    '../../assets/images/outputs',
    filename,
  );

  if (fs.existsSync(outputPath)) {
    res.sendFile(outputPath);
    return;
  }

  try {
    await sharp(file.path)
      .resize(parseInt(width), parseInt(height))
      .toFile(outputPath);
    fs.unlinkSync(file.path); // Delete the original file after processing
    res.sendFile(outputPath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing image');
  }
});

export default imagerouter;
