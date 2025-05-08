import axios from 'axios';
import { fetchDemoURL } from '../../tools/fetchDemoURL';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchDemoURL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch HuggingFace demo URL successfully', async () => {
    const mockResponse = {
      data: {
        spaces: [{ url: 'https://huggingface.co/spaces/test-space' }]
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const input = {
      modelId: 'test-model',
      provider: 'huggingface'
    };

    const result = await fetchDemoURL(input);
    expect(result).toEqual({ demoUrl: 'https://huggingface.co/spaces/test-space' });
  });

  it('should fallback to model page for HuggingFace when no space is available', async () => {
    const mockResponse = {
      data: {
        spaces: []
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const input = {
      modelId: 'test-model',
      provider: 'huggingface'
    };

    const result = await fetchDemoURL(input);
    expect(result).toEqual({ demoUrl: 'https://huggingface.co/test-model' });
  });

  it('should fetch Replicate demo URL successfully', async () => {
    const mockResponse = {
      data: {
        url: 'https://replicate.com/test-model'
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const input = {
      modelId: 'test-model',
      provider: 'replicate'
    };

    const result = await fetchDemoURL(input);
    expect(result).toEqual({ demoUrl: 'https://replicate.com/test-model' });
  });

  it('should return Stability AI docs URL', async () => {
    const input = {
      modelId: 'test-model',
      provider: 'stability'
    };

    const result = await fetchDemoURL(input);
    expect(result).toEqual({
      demoUrl: 'https://platform.stability.ai/docs/api-reference'
    });
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    const input = {
      modelId: 'test-model',
      provider: 'huggingface'
    };

    const result = await fetchDemoURL(input);
    expect(result).toEqual({ demoUrl: 'https://huggingface.co/test-model' });
  });

  it('should throw error for unsupported provider', async () => {
    const input = {
      modelId: 'test-model',
      provider: 'unsupported' as any
    };

    await expect(fetchDemoURL(input)).rejects.toThrow('Unsupported provider: unsupported');
  });
}); 