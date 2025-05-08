import express from 'express';
import dotenv from 'dotenv';
import { inferenceRunner } from './tools/inferenceRunner';
import { compareModels } from './tools/compareModels';
import { fetchDemoURL } from './tools/fetchDemoURL';

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.post('/inference', async (req, res) => {
  try {
    const result = await inferenceRunner(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/compare', async (req, res) => {
  try {
    const result = await compareModels(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/demo', async (req, res) => {
  try {
    const result = await fetchDemoURL(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 