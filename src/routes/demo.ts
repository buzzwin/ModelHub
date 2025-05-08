import express from 'express';
import { fetchDemoURL } from '../tools/fetchDemoURL';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { modelId, provider } = req.body;

    if (!modelId) {
      return res.status(400).json({ error: 'Model ID is required' });
    }

    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' });
    }

    const validProviders = ['huggingface', 'openai', 'claude', 'gemini'];
    if (!validProviders.includes(provider)) {
      return res.status(400).json({ 
        error: `Invalid provider: ${provider}. Valid providers are: ${validProviders.join(', ')}` 
      });
    }

    const result = await fetchDemoURL({ modelId, provider });
    res.json({ demoUrl: result });
  } catch (error) {
    console.error('Demo URL error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 