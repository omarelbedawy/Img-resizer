import request from 'supertest';
import app from '../index';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

describe('Image Resizer Tests', () => {
  const testImagePath = path.join(__dirname, 'test-image.jpg');
  const outputDir = path.join(__dirname, '../assets/images/outputs');

  // Create test image before tests
  beforeAll(async () => {
    // Create test image
    await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    })
    .jpeg()
    .toFile(testImagePath);

    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  });

  // Clean up after tests
  afterAll(() => {
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  });

  // Test API endpoints
  describe('API Endpoints', () => {
    it('should return API running message', async () => {
      const response = await request(app).get('/api');
      expect(response.status).toBe(200);
      expect(response.text).toBe('API is running...');
    });

    it('should serve static files', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });
  });

  // Test upload and resize endpoint
  describe('Upload and Resize Endpoint', () => {
    it('should upload and resize image successfully', async () => {
      const response = await request(app)
        .post('/api/images/upload')
        .attach('image', testImagePath)
        .field('width', '50')
        .field('height', '50');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('image');
    });

    it('should return 400 when image is missing', async () => {
      const response = await request(app)
        .post('/api/images/upload')
        .field('width', '50')
        .field('height', '50');

      expect(response.status).toBe(400);
    });

    it('should return 400 when width is missing', async () => {
      const response = await request(app)
        .post('/api/images/upload')
        .attach('image', testImagePath)
        .field('height', '50');

      expect(response.status).toBe(400);
    });

    it('should return 400 when height is missing', async () => {
      const response = await request(app)
        .post('/api/images/upload')
        .attach('image', testImagePath)
        .field('width', '50');

      expect(response.status).toBe(400);
    });
  });

  // Test image processing function directly
  describe('Direct Image Processing', () => {
    it('should resize image using Sharp directly', async () => {
      const outputPath = path.join(outputDir, 'test-output.jpg');
      
      await sharp(testImagePath)
        .resize(75, 75)
        .toFile(outputPath);

      expect(fs.existsSync(outputPath)).toBe(true);
      
      const metadata = await sharp(outputPath).metadata();
      expect(metadata.width).toBe(75);
      expect(metadata.height).toBe(75);

      // Clean up
      fs.unlinkSync(outputPath);
    });

    it('should convert image format', async () => {
      const outputPath = path.join(outputDir, 'test-output.png');
      
      await sharp(testImagePath)
        .resize(60, 60)
        .png()
        .toFile(outputPath);

      expect(fs.existsSync(outputPath)).toBe(true);
      
      const metadata = await sharp(outputPath).metadata();
      expect(metadata.format).toBe('png');

      // Clean up
      fs.unlinkSync(outputPath);
    });

    it('should apply grayscale filter', async () => {
      const outputPath = path.join(outputDir, 'test-grayscale.jpg');
      
      await sharp(testImagePath)
        .resize(80, 80)
        .grayscale()
        .toFile(outputPath);

      expect(fs.existsSync(outputPath)).toBe(true);
      
      const metadata = await sharp(outputPath).metadata();
      expect(metadata.channels).toBe(1);

      // Clean up
      fs.unlinkSync(outputPath);
    });
  });
});