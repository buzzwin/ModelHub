import express from 'express';
import { compareModels } from '../tools/compareModels';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { models, metrics } = req.body;
    
    if (!models || !Array.isArray(models) || models.length === 0) {
      return res.status(400).json({ error: 'Models array is required and must not be empty' });
    }

    if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
      return res.status(400).json({ error: 'Metrics array is required and must not be empty' });
    }

    const validMetrics = ['latency', 'modality', 'popularity', 'cost', 'capabilities'];
    const invalidMetrics = metrics.filter(metric => !validMetrics.includes(metric));
    
    if (invalidMetrics.length > 0) {
      return res.status(400).json({ 
        error: `Invalid metrics: ${invalidMetrics.join(', ')}. Valid metrics are: ${validMetrics.join(', ')}` 
      });
    }

    const result = await compareModels({ models, metrics });
    res.json(result);
  } catch (error) {
    console.error('Compare error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 