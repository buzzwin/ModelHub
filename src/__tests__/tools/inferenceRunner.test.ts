import axios from 'axios';
import { inferenceRunner } from '../../tools/inferenceRunner';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('inferenceRunner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should run HuggingFace inference successfully', async () => {
    const mockResponse = { data: { result: 'test result' } };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const input = {
      modelId: 'test-model',
      provider: 'huggingface',
      input: { prompt: 'test prompt' }
    };

    const result = await inferenceRunner(input);
    expect(result).toEqual({ result: 'test result' });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api-inference.huggingface.co/models/test-model',
      { prompt: 'test prompt' },
      expect.any(Object)
    );
  });

  it('should run Replicate inference successfully', async () => {
    const mockResponse = { data: { result: 'test result' } };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const input = {
      modelId: 'test-model',
      provider: 'replicate',
      input: { prompt: 'test prompt' }
    };

    const result = await inferenceRunner(input);
    expect(result).toEqual({ result: 'test result' });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'test-model',
        input: { prompt: 'test prompt' }
      },
      expect.any(Object)
    );
  });

  it('should handle errors gracefully', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

    const input = {
      modelId: 'test-model',
      provider: 'huggingface',
      input: { prompt: 'test prompt' }
    };

    await expect(inferenceRunner(input)).rejects.toThrow('API Error');
  });

  it('should throw error for unsupported provider', async () => {
    const input = {
      modelId: 'test-model',
      provider: 'unsupported' as any,
      input: { prompt: 'test prompt' }
    };

    await expect(inferenceRunner(input)).rejects.toThrow('Unsupported provider: unsupported');
  });
}); 