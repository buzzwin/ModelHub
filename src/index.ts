import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import inferenceRouter from './routes/inference';
import compareRouter from './routes/compare';
import demoRouter from './routes/demo';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/inference', inferenceRouter);
app.use('/compare', compareRouter);
app.use('/demo', demoRouter);

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 