import express from 'express';
import router from './routes/router';
import path from 'path';
import cors from 'cors';
const app = express();
const port = 3000;

// Define a route handler for the default home page
app.use('/api', router);

// Enable CORS for all routes
app.use(cors());

//To connect the backend with the frontend
app.use(express.static(path.join(__dirname, '../../Front-end')));
//serve the resized images
app.use(express.static(path.join(__dirname, '../../assets/images/outputs')));

// Start the Express server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

export default app;
