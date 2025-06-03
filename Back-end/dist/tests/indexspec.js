"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// --- Imports ---
var supertest_1 = __importDefault(require("supertest"));
var path_1 = __importDefault(require("path"));
var promises_1 = __importDefault(require("fs/promises")); // Using fs.promises for async file operations
var index_1 = __importDefault(require("../index")); // CORRECTED PATH for the main Express app
var images_1 = require("../routes/api/images"); // CORRECTED PATH for the processImage function
// Create a supertest agent for making API requests
var request = (0, supertest_1.default)(index_1.default);
var ASSETS_DIR = path_1.default.resolve(__dirname, '../../src/assets/images');
var UPLOADS_DIR = path_1.default.resolve(ASSETS_DIR, 'uploads'); // As per the image structure
var OUTPUTS_DIR = path_1.default.resolve(ASSETS_DIR, 'outputs'); // As per the image structure
var TEST_IMAGE_FILENAME = 'test.png'; // Source image for testing
var SOURCE_IMAGE_PATH = path_1.default.join(UPLOADS_DIR, TEST_IMAGE_FILENAME);
describe('Image Resizer Application Tests', function () {
    // Before all tests, ensure necessary directories exist and a test image is available.
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var dummyImagePath, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, promises_1.default.mkdir(UPLOADS_DIR, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.mkdir(OUTPUTS_DIR, { recursive: true })];
                case 2:
                    _a.sent();
                    dummyImagePath = SOURCE_IMAGE_PATH;
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, promises_1.default.access(dummyImagePath)];
                case 4:
                    _a.sent();
                    console.log("Using existing test image: ".concat(dummyImagePath));
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.warn("Created dummy test image at: ".concat(dummyImagePath, ". ") +
                        "Please replace with a real PNG for actual image processing.");
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    console.error('Error during test setup (beforeAll):', error_2);
                    fail('Failed to set up test environment.');
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    // After all tests, clean up any generated output files and temporary uploaded files.
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var outputFiles, _i, outputFiles_1, file, uploadFiles, _a, uploadFiles_1, file, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 11, , 12]);
                    return [4 /*yield*/, promises_1.default.readdir(OUTPUTS_DIR)];
                case 1:
                    outputFiles = _b.sent();
                    _i = 0, outputFiles_1 = outputFiles;
                    _b.label = 2;
                case 2:
                    if (!(_i < outputFiles_1.length)) return [3 /*break*/, 5];
                    file = outputFiles_1[_i];
                    if (!(file.startsWith("".concat(path_1.default.parse(TEST_IMAGE_FILENAME).name, "_")) || file.includes('_direct'))) return [3 /*break*/, 4];
                    return [4 /*yield*/, promises_1.default.unlink(path_1.default.join(OUTPUTS_DIR, file))];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, promises_1.default.readdir(UPLOADS_DIR)];
                case 6:
                    uploadFiles = _b.sent();
                    _a = 0, uploadFiles_1 = uploadFiles;
                    _b.label = 7;
                case 7:
                    if (!(_a < uploadFiles_1.length)) return [3 /*break*/, 10];
                    file = uploadFiles_1[_a];
                    if (!(file !== TEST_IMAGE_FILENAME)) return [3 /*break*/, 9];
                    return [4 /*yield*/, promises_1.default.unlink(path_1.default.join(UPLOADS_DIR, file)).catch(function () { })];
                case 8:
                    _b.sent(); // Use catch to ignore errors if file is already gone
                    _b.label = 9;
                case 9:
                    _a++;
                    return [3 /*break*/, 7];
                case 10: return [3 /*break*/, 12];
                case 11:
                    error_3 = _b.sent();
                    console.error('Error during test teardown (afterAll):', error_3);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    }); });
    // --- API Endpoint Tests: POST /api/images/upload ---
    describe('API Endpoint: POST /api/images/upload', function () {
        // Test 1: Basic successful image upload and resizing via API
        it('should return 200 and process the uploaded image with valid parameters', function () { return __awaiter(void 0, void 0, void 0, function () {
            var width, height, outputFilename, outputPath, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        width = 200;
                        height = 150;
                        outputFilename = "".concat(path_1.default.parse(TEST_IMAGE_FILENAME).name, "_").concat(width, "x").concat(height).concat(path_1.default.parse(TEST_IMAGE_FILENAME).ext);
                        outputPath = path_1.default.join(OUTPUTS_DIR, outputFilename);
                        return [4 /*yield*/, request.post('/api/images/upload')
                                .attach('image', SOURCE_IMAGE_PATH) // Attach the test image file
                                .field('width', width.toString()) // Add width as a form field
                                .field('height', height.toString())];
                    case 1:
                        response = _a.sent();
                        expect(response.status).toBe(200);
                        expect(response.headers['content-type']).toMatch(/image\/(jpeg|png)/); // Expecting an image response
                        // Verify the file was created on disk
                        return [4 /*yield*/, expectAsync(promises_1.default.access(outputPath)).toBeResolved()];
                    case 2:
                        // Verify the file was created on disk
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Test 2: Missing image file
        it('should return 400 if image file is missing', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request.post('/api/images/upload')
                            .field('width', '100')
                            .field('height', '100')];
                    case 1:
                        response = _a.sent();
                        expect(response.status).toBe(400);
                        expect(response.text).toContain('Missing data'); // Your backend sends 'Missing data' as text
                        return [2 /*return*/];
                }
            });
        }); });
        // Test 3: Missing width parameter
        it('should return 400 if width parameter is missing', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request.post('/api/images/upload')
                            .attach('image', SOURCE_IMAGE_PATH)
                            .field('height', '100')];
                    case 1:
                        response = _a.sent();
                        expect(response.status).toBe(400);
                        expect(response.text).toContain('Missing data');
                        return [2 /*return*/];
                }
            });
        }); });
        // Test 4: Missing height parameter
        it('should return 400 if height parameter is missing', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request.post('/api/images/upload')
                            .attach('image', SOURCE_IMAGE_PATH)
                            .field('width', '100')];
                    case 1:
                        response = _a.sent();
                        expect(response.status).toBe(400);
                        expect(response.text).toContain('Missing data');
                        return [2 /*return*/];
                }
            });
        }); });
        // Test 5: Invalid width parameter (non-numeric)
        it('should return 500 if width parameter is invalid (e.g., non-numeric)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request.post('/api/images/upload')
                            .attach('image', SOURCE_IMAGE_PATH)
                            .field('width', 'abc')
                            .field('height', '100')];
                    case 1:
                        response = _a.sent();
                        expect(response.status).toBe(500);
                        expect(response.text).toContain('Error processing image'); // Sharp will likely throw an error, caught by your backend
                        return [2 /*return*/];
                }
            });
        }); });
        // Test 6: Invalid height parameter (negative)
        it('should return 500 if height parameter is invalid (e.g., negative)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request.post('/api/images/upload')
                            .attach('image', SOURCE_IMAGE_PATH)
                            .field('width', '100')
                            .field('height', '-50')];
                    case 1:
                        response = _a.sent();
                        expect(response.status).toBe(500);
                        expect(response.text).toContain('Error processing image');
                        return [2 /*return*/];
                }
            });
        }); });
        // Test 7: Uploading a non-image file (Multer might handle this, or Sharp will fail)
        it('should handle non-image file uploads gracefully (e.g., return 500)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var nonImagePath, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nonImagePath = path_1.default.join(__dirname, 'test.txt');
                        return [4 /*yield*/, promises_1.default.writeFile(nonImagePath, 'This is not an image.')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, request.post('/api/images/upload')
                                .attach('image', nonImagePath)
                                .field('width', '100')
                                .field('height', '100')];
                    case 2:
                        response = _a.sent();
                        expect(response.status).toBe(500); // Sharp will likely fail on a non-image file
                        expect(response.text).toContain('Error processing image');
                        return [4 /*yield*/, promises_1.default.unlink(nonImagePath)];
                    case 3:
                        _a.sent(); // Clean up dummy text file
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // --- Direct Image Processing Function Tests ---
    // These tests require you to refactor your images.ts to export the 'processImage' function.
    describe('Image Processing Function: processImage()', function () {
        // Test 1: Successful image transformation
        it('should transform the image without throwing an error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testWidth, testHeight, outputFilename, outputPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testWidth = 120;
                        testHeight = 80;
                        outputFilename = "".concat(path_1.default.parse(TEST_IMAGE_FILENAME).name, "_").concat(testWidth, "x").concat(testHeight, "_direct").concat(path_1.default.parse(TEST_IMAGE_FILENAME).ext);
                        outputPath = path_1.default.join(OUTPUTS_DIR, outputFilename);
                        // The reviewer's suggested test spec:
                        return [4 /*yield*/, expectAsync((0, images_1.processImage)(SOURCE_IMAGE_PATH, testWidth, testHeight, outputPath))
                                .toBeResolved()];
                    case 1:
                        // The reviewer's suggested test spec:
                        _a.sent(); // Expect the promise to resolve without error
                        // Verify the file was actually created
                        return [4 /*yield*/, expectAsync(promises_1.default.access(outputPath)).toBeResolved()];
                    case 2:
                        // Verify the file was actually created
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Test 2: Handling of non-existent source file
        it('should throw an error for a non-existent source image path', function () { return __awaiter(void 0, void 0, void 0, function () {
            var nonExistentPath, testWidth, testHeight, outputPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nonExistentPath = path_1.default.join(UPLOADS_DIR, 'non_existent_source.png');
                        testWidth = 50;
                        testHeight = 50;
                        outputPath = path_1.default.join(OUTPUTS_DIR, 'dummy_output_nonexistent.png');
                        return [4 /*yield*/, expectAsync((0, images_1.processImage)(nonExistentPath, testWidth, testHeight, outputPath))
                                .toBeRejectedWithError(/Error processing image/)];
                    case 1:
                        _a.sent(); // Expect a specific error from your function
                        return [2 /*return*/];
                }
            });
        }); });
        // Test 3: Handling of invalid dimensions (e.g., zero width)
        it('should throw an error for invalid dimensions (e.g., zero width)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testWidth, testHeight, outputFilename, outputPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testWidth = 0;
                        testHeight = 100;
                        outputFilename = "".concat(path_1.default.parse(TEST_IMAGE_FILENAME).name, "_").concat(testWidth, "x").concat(testHeight, "_direct_invalid_width").concat(path_1.default.parse(TEST_IMAGE_FILENAME).ext);
                        outputPath = path_1.default.join(OUTPUTS_DIR, outputFilename);
                        return [4 /*yield*/, expectAsync((0, images_1.processImage)(SOURCE_IMAGE_PATH, testWidth, testHeight, outputPath))
                                .toBeRejectedWithError(/Invalid dimensions|Error processing image/)];
                    case 1:
                        _a.sent(); // Expect an error related to dimensions or sharp
                        return [2 /*return*/];
                }
            });
        }); });
        // Test 4: Handling of invalid dimensions (e.g., zero height)
        it('should throw an error for invalid dimensions (e.g., zero height)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testWidth, testHeight, outputFilename, outputPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testWidth = 100;
                        testHeight = 0;
                        outputFilename = "".concat(path_1.default.parse(TEST_IMAGE_FILENAME).name, "_").concat(testWidth, "x").concat(testHeight, "_direct_invalid_height").concat(path_1.default.parse(TEST_IMAGE_FILENAME).ext);
                        outputPath = path_1.default.join(OUTPUTS_DIR, outputFilename);
                        return [4 /*yield*/, expectAsync((0, images_1.processImage)(SOURCE_IMAGE_PATH, testWidth, testHeight, outputPath))
                                .toBeRejectedWithError(/Invalid dimensions|Error processing image/)];
                    case 1:
                        _a.sent(); // Expect an error related to dimensions or sharp
                        return [2 /*return*/];
                }
            });
        }); });
        // Test 5: Handling of non-numeric dimensions
        it('should throw an error for non-numeric dimensions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testWidth, testHeight, outputFilename, outputPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testWidth = 'abc';
                        testHeight = 100;
                        outputFilename = "".concat(path_1.default.parse(TEST_IMAGE_FILENAME).name, "_").concat(testWidth, "x").concat(testHeight, "_direct_nan_width").concat(path_1.default.parse(TEST_IMAGE_FILENAME).ext);
                        outputPath = path_1.default.join(OUTPUTS_DIR, outputFilename);
                        return [4 /*yield*/, expectAsync((0, images_1.processImage)(SOURCE_IMAGE_PATH, testWidth, testHeight, outputPath))
                                .toBeRejectedWithError(/Invalid dimensions|Error processing image/)];
                    case 1:
                        _a.sent(); // Expect an error related to dimensions or sharp
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
