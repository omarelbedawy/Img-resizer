"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router_1 = __importDefault(require("./routes/router"));
var path_1 = __importDefault(require("path"));
var cors_1 = __importDefault(require("cors"));
var app = (0, express_1.default)();
var port = 3000;
// Define a route handler for the default home page
app.use('/api', router_1.default);
// Enable CORS for all routes
app.use((0, cors_1.default)());
//To connect the backend with the frontend
app.use(express_1.default.static(path_1.default.join(__dirname, '../../Front-end')));
//serve the resized images
app.use(express_1.default.static(path_1.default.join(__dirname, '../../assets/images/outputs')));
// Start the Express server
app.listen(port, function () {
    console.log("Server started at http://localhost:".concat(port));
});
exports.default = app;
