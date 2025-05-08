import express from 'express';
import { inferenceRunner } from '../tools/inferenceRunner';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = await inferenceRunner(req.body);
    res.json(result);
  } catch (error) {
    console.error('Inference error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 