// This file contains the test specifications for the image resizing application.
// It includes both API endpoint tests using supertest and direct function invocation tests
// for the image processing logic, as requested by the reviewer.

// --- Imports ---
import supertest from 'supertest';
import path from 'path';
import fs from 'fs/promises'; // Using fs.promises for async file operations

// IMPORTANT PATH CORRECTION:
// Original: import app from '../../src/index';
// Explanation:
// Your indexspec.ts is in 'src/tests/'. When compiled, it becomes 'dist/tests/indexspec.js'.
// Your main app (src/index.ts) compiles to 'dist/index.js'.
// To reach 'dist/index.js' from 'dist/tests/indexspec.js', you go up one directory (../) to 'dist/',
// and then reference 'index'.
import app from '../index'; // CORRECTED PATH for the main Express app

// IMPORTANT PATH CORRECTION:
// Original: import { processImage } from '../../src/routes/api/images';
// Explanation:
// Your indexspec.ts is in 'src/tests/'. When compiled, it becomes 'dist/tests/indexspec.js'.
// Your processImage function (src/routes/api/images.ts) compiles to 'dist/routes/api/images.js'.
// To reach 'dist/routes/api/images.js' from 'dist/tests/indexspec.js', you go up one directory (../) to 'dist/',
// then into 'routes/api/', and then reference 'images'.
import { processImage } from '../routes/api/images'; // CORRECTED PATH for the processImage function


// Create a supertest agent for making API requests
const request = supertest(app);

// --- Path Definitions ---
// Define paths relative to the 'Image-resizer/Image-resizer/Back-end/src/tests/' directory
// __dirname here refers to the directory of the *source* file (src/tests/)
// '../../assets/images' correctly points to 'Back-end/src/assets/images'
const ASSETS_DIR = path.resolve(__dirname, '../../assets/images');
const UPLOADS_DIR = path.resolve(ASSETS_DIR, 'uploads'); // As per the image structure
const OUTPUTS_DIR = path.resolve(ASSETS_DIR, 'outputs'); // As per the image structure

const TEST_IMAGE_FILENAME = 'test.png'; // Source image for testing
const SOURCE_IMAGE_PATH = path.join(UPLOADS_DIR, TEST_IMAGE_FILENAME);

describe('Image Resizer Application Tests', () => {

    // Before all tests, ensure necessary directories exist and a test image is available.
    beforeAll(async () => {
        try {
            await fs.mkdir(UPLOADS_DIR, { recursive: true });
            await fs.mkdir(OUTPUTS_DIR, { recursive: true });

            // Create a dummy test image if it doesn't exist.
            // In a production test suite, you'd typically have a small fixture image
            // copied into your test environment.
            const dummyImagePath = SOURCE_IMAGE_PATH;
            try {
                await fs.access(dummyImagePath);
                console.log(`Using existing test image: ${dummyImagePath}`);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                // If the file doesn't exist, create a tiny dummy file.
                // NOTE: For actual image processing, this dummy file won't work.
                // You MUST place a real, small image file named 'test.png'
                // in 'src/assets/images/uploads/' for the image processing to succeed.
                await fs.writeFile(dummyImagePath, 'dummy image data for testing');
                console.warn(`Created dummy test image at: ${dummyImagePath}. ` +
                             `Please replace with a real PNG for actual image processing.`);
            }
        } catch (error) {
            console.error('Error during test setup (beforeAll):', error);
            fail('Failed to set up test environment.');
        }
    });

    // After all tests, clean up any generated output files and temporary uploaded files.
    afterAll(async () => {
        try {
            // Clean up any generated output images
            const outputFiles = await fs.readdir(OUTPUTS_DIR);
            for (const file of outputFiles) {
                // Check if the file name matches the pattern of generated files
                if (file.startsWith(`${path.parse(TEST_IMAGE_FILENAME).name}_`) || file.includes('_direct')) {
                    await fs.unlink(path.join(OUTPUTS_DIR, file));
                }
            }
            // Clean up any temporary files created by multer in the uploads directory during tests
            const uploadFiles = await fs.readdir(UPLOADS_DIR);
            for (const file of uploadFiles) {
                // Multer creates files with random names. We can try to remove them if they are not our source test image.
                if (file !== TEST_IMAGE_FILENAME) {
                    await fs.unlink(path.join(UPLOADS_DIR, file)).catch(() => {}); // Use catch to ignore errors if file is already gone
                }
            }
            // Optionally, remove the dummy test image if it was created by the test setup
            // await fs.unlink(SOURCE_IMAGE_PATH);
        } catch (error) {
            console.error('Error during test teardown (afterAll):', error);
        }
    });

    // --- API Endpoint Tests: POST /api/images/upload ---
    describe('API Endpoint: POST /api/images/upload', () => {
        // Test 1: Basic successful image upload and resizing via API
        it('should return 200 and process the uploaded image with valid parameters', async () => {
            const width = 200;
            const height = 150;
            const outputFilename = `${path.parse(TEST_IMAGE_FILENAME).name}_${width}x${height}${path.parse(TEST_IMAGE_FILENAME).ext}`;
            const outputPath = path.join(OUTPUTS_DIR, outputFilename);

            const response = await request.post('/api/images/upload')
                .attach('image', SOURCE_IMAGE_PATH) // Attach the test image file
                .field('width', width.toString())    // Add width as a form field
                .field('height', height.toString()); // Add height as a form field

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/image\/(jpeg|png)/); // Expecting an image response
            // Verify the file was created on disk
            await expectAsync(fs.access(outputPath)).toBeResolved();
        });

        // Test 2: Missing image file
        it('should return 400 if image file is missing', async () => {
            const response = await request.post('/api/images/upload')
                .field('width', '100')
                .field('height', '100');
            expect(response.status).toBe(400);
            expect(response.text).toContain('Missing data'); // Your backend sends 'Missing data' as text
        });

        // Test 3: Missing width parameter
        it('should return 400 if width parameter is missing', async () => {
            const response = await request.post('/api/images/upload')
                .attach('image', SOURCE_IMAGE_PATH)
                .field('height', '100');
            expect(response.status).toBe(400);
            expect(response.text).toContain('Missing data');
        });

        // Test 4: Missing height parameter
        it('should return 400 if height parameter is missing', async () => {
            const response = await request.post('/api/images/upload')
                .attach('image', SOURCE_IMAGE_PATH)
                .field('width', '100');
            expect(response.status).toBe(400);
            expect(response.text).toContain('Missing data');
        });

        // Test 5: Invalid width parameter (non-numeric)
        it('should return 500 if width parameter is invalid (e.g., non-numeric)', async () => {
            const response = await request.post('/api/images/upload')
                .attach('image', SOURCE_IMAGE_PATH)
                .field('width', 'abc')
                .field('height', '100');
            expect(response.status).toBe(500);
            expect(response.text).toContain('Error processing image'); // Sharp will likely throw an error, caught by your backend
        });

        // Test 6: Invalid height parameter (negative)
        it('should return 500 if height parameter is invalid (e.g., negative)', async () => {
            const response = await request.post('/api/images/upload')
                .attach('image', SOURCE_IMAGE_PATH)
                .field('width', '100')
                .field('height', '-50');
            expect(response.status).toBe(500);
            expect(response.text).toContain('Error processing image');
        });

        // Test 7: Uploading a non-image file (Multer might handle this, or Sharp will fail)
        it('should handle non-image file uploads gracefully (e.g., return 500)', async () => {
            const nonImagePath = path.join(__dirname, 'test.txt'); // Create a dummy text file
            await fs.writeFile(nonImagePath, 'This is not an image.');

            const response = await request.post('/api/images/upload')
                .attach('image', nonImagePath)
                .field('width', '100')
                .field('height', '100');

            expect(response.status).toBe(500); // Sharp will likely fail on a non-image file
            expect(response.text).toContain('Error processing image');

            await fs.unlink(nonImagePath); // Clean up dummy text file
        });
    });

    // --- Direct Image Processing Function Tests ---
    // These tests require you to refactor your images.ts to export the 'processImage' function.
    describe('Image Processing Function: processImage()', () => {
        // Test 1: Successful image transformation
        it('should transform the image without throwing an error', async () => {
            const testWidth = 120;
            const testHeight = 80;
            const outputFilename = `${path.parse(TEST_IMAGE_FILENAME).name}_${testWidth}x${testHeight}_direct${path.parse(TEST_IMAGE_FILENAME).ext}`;
            const outputPath = path.join(OUTPUTS_DIR, outputFilename);

            // The reviewer's suggested test spec:
            await expectAsync(processImage(SOURCE_IMAGE_PATH, testWidth, testHeight, outputPath))
                .toBeResolved(); // Expect the promise to resolve without error

            // Verify the file was actually created
            await expectAsync(fs.access(outputPath)).toBeResolved();
        });

        // Test 2: Handling of non-existent source file
        it('should throw an error for a non-existent source image path', async () => {
            const nonExistentPath = path.join(UPLOADS_DIR, 'non_existent_source.png');
            const testWidth = 50;
            const testHeight = 50;
            const outputPath = path.join(OUTPUTS_DIR, 'dummy_output_nonexistent.png');

            await expectAsync(processImage(nonExistentPath, testWidth, testHeight, outputPath))
                .toBeRejectedWithError(/Error processing image/); // Expect a specific error from your function
        });

        // Test 3: Handling of invalid dimensions (e.g., zero width)
        it('should throw an error for invalid dimensions (e.g., zero width)', async () => {
            const testWidth = 0;
            const testHeight = 100;
            const outputFilename = `${path.parse(TEST_IMAGE_FILENAME).name}_${testWidth}x${testHeight}_direct_invalid_width${path.parse(TEST_IMAGE_FILENAME).ext}`;
            const outputPath = path.join(OUTPUTS_DIR, outputFilename);

            await expectAsync(processImage(SOURCE_IMAGE_PATH, testWidth, testHeight, outputPath))
                .toBeRejectedWithError(/Invalid dimensions|Error processing image/); // Expect an error related to dimensions or sharp
        });

        // Test 4: Handling of invalid dimensions (e.g., zero height)
        it('should throw an error for invalid dimensions (e.g., zero height)', async () => {
            const testWidth = 100;
            const testHeight = 0;
            const outputFilename = `${path.parse(TEST_IMAGE_FILENAME).name}_${testWidth}x${testHeight}_direct_invalid_height${path.parse(TEST_IMAGE_FILENAME).ext}`;
            const outputPath = path.join(OUTPUTS_DIR, outputFilename);

            await expectAsync(processImage(SOURCE_IMAGE_PATH, testWidth, testHeight, outputPath))
                .toBeRejectedWithError(/Invalid dimensions|Error processing image/); // Expect an error related to dimensions or sharp
        });

        // Test 5: Handling of non-numeric dimensions
        it('should throw an error for non-numeric dimensions', async () => {
            const testWidth: unknown = 'abc'; // Intentionally pass a non-numeric value
            const testHeight = 100;
            const outputFilename = `${path.parse(TEST_IMAGE_FILENAME).name}_${testWidth}x${testHeight}_direct_nan_width${path.parse(TEST_IMAGE_FILENAME).ext}`;
            const outputPath = path.join(OUTPUTS_DIR, outputFilename);

            await expectAsync(processImage(SOURCE_IMAGE_PATH, testWidth as number, testHeight, outputPath))
                .toBeRejectedWithError(/Invalid dimensions|Error processing image/); // Expect an error related to dimensions or sharp
        });
    });
});
