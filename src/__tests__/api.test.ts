import request from 'supertest';
import express from 'express';
import { inferenceRunner } from '../tools/inferenceRunner';
import { compareModels } from '../tools/compareModels';
import { fetchDemoURL } from '../tools/fetchDemoURL';

// Mock the tool functions
jest.mock('../tools/inferenceRunner');
jest.mock('../tools/compareModels');
jest.mock('../tools/fetchDemoURL');

const mockedInferenceRunner = inferenceRunner as jest.MockedFunction<typeof inferenceRunner>;
const mockedCompareModels = compareModels as jest.MockedFunction<typeof compareModels>;
const mockedFetchDemoURL = fetchDemoURL as jest.MockedFunction<typeof fetchDemoURL>;

describe('API Endpoints', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Setup routes
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
  });

  describe('POST /inference', () => {
    it('should return inference result', async () => {
      const mockResult = { result: 'test result' };
      mockedInferenceRunner.mockResolvedValueOnce(mockResult);

      const response = await request(app)
        .post('/inference')
        .send({
          modelId: 'test-model',
          provider: 'huggingface',
          input: { prompt: 'test prompt' }
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
    });

    it('should handle errors', async () => {
      mockedInferenceRunner.mockRejectedValueOnce(new Error('API Error'));

      const response = await request(app)
        .post('/inference')
        .send({
          modelId: 'test-model',
          provider: 'huggingface',
          input: { prompt: 'test prompt' }
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'API Error' });
    });
  });

  describe('POST /compare', () => {
    it('should compare models successfully', async () => {
      const mockResult = [
        {
          id: 'gpt-4',
          modality: 'text',
          cost: {
            input: 0.03,
            output: 0.06,
          },
          capabilities: {
            text: true,
            image: true,
            audio: false,
            video: false,
            multimodal: true,
          },
        },
      ];

      mockedCompareModels.mockResolvedValueOnce(mockResult);

      const response = await request(app)
        .post('/compare')
        .send({
          models: ['gpt-4'],
          metrics: ['modality', 'cost', 'capabilities'],
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(mockedCompareModels).toHaveBeenCalledWith({
        models: ['gpt-4'],
        metrics: ['modality', 'cost', 'capabilities'],
      });
    });

    it('should handle invalid metrics', async () => {
      const response = await request(app)
        .post('/compare')
        .send({
          models: ['gpt-4'],
          metrics: ['invalid-metric'],
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid metrics');
    });

    it('should handle empty models array', async () => {
      const response = await request(app)
        .post('/compare')
        .send({
          models: [],
          metrics: ['cost'],
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('models must be a non-empty array');
    });

    it('should handle empty metrics array', async () => {
      const response = await request(app)
        .post('/compare')
        .send({
          models: ['gpt-4'],
          metrics: [],
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('metrics must be a non-empty array');
    });

    it('should handle comparison errors', async () => {
      mockedCompareModels.mockRejectedValueOnce(new Error('Comparison failed'));

      const response = await request(app)
        .post('/compare')
        .send({
          models: ['gpt-4'],
          metrics: ['cost'],
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details).toBe('Comparison failed');
    });
  });

  describe('POST /demo', () => {
    it('should return demo URL', async () => {
      const mockResult = { demoUrl: 'https://test-demo.com' };
      mockedFetchDemoURL.mockResolvedValueOnce(mockResult);

      const response = await request(app)
        .post('/demo')
        .send({
          modelId: 'test-model',
          provider: 'huggingface'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
    });

    it('should handle errors', async () => {
      mockedFetchDemoURL.mockRejectedValueOnce(new Error('API Error'));

      const response = await request(app)
        .post('/demo')
        .send({
          modelId: 'test-model',
          provider: 'huggingface'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'API Error' });
    });
  });
}); 