import express from 'express';
import { compareModels } from '../tools/compareModels';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { models, metrics } = req.body;

    if (!models || !Array.isArray(models) || models.length === 0) {
      return res.status(400).json({
        error: 'Invalid request: models must be a non-empty array',
      });
    }

    if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
      return res.status(400).json({
        error: 'Invalid request: metrics must be a non-empty array',
      });
    }

    // Validate metrics
    const validMetrics = ['latency', 'modality', 'popularity', 'cost', 'capabilities'];
    const invalidMetrics = metrics.filter(metric => !validMetrics.includes(metric));
    
    if (invalidMetrics.length > 0) {
      return res.status(400).json({
        error: `Invalid metrics: ${invalidMetrics.join(', ')}. Valid metrics are: ${validMetrics.join(', ')}`,
      });
    }

    const result = await compareModels({ models, metrics });
    res.json(result);
  } catch (error) {
    console.error('Error comparing models:', error);
    res.status(500).json({
      error: 'Failed to compare models',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router; 