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
        spaces: [
          { id: 'test-space', url: 'https://huggingface.co/spaces/test-space' }
        ]
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await fetchDemoURL({
      modelId: 'test-model',
      provider: 'huggingface'
    });

    expect(result).toBe('https://huggingface.co/spaces/test-space');
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('huggingface.co/api/models/test-model'),
      expect.any(Object)
    );
  });

  it('should fetch OpenAI demo URL successfully', async () => {
    const result = await fetchDemoURL({
      modelId: 'gpt-4',
      provider: 'openai'
    });

    expect(result).toBe('https://platform.openai.com/docs/models/gpt-4');
  });

  it('should fetch Claude demo URL successfully', async () => {
    const result = await fetchDemoURL({
      modelId: 'claude-3-opus',
      provider: 'claude'
    });

    expect(result).toBe('https://docs.anthropic.com/claude/docs/models-overview');
  });

  it('should fetch Gemini demo URL successfully', async () => {
    const result = await fetchDemoURL({
      modelId: 'gemini-pro',
      provider: 'gemini'
    });

    expect(result).toBe('https://ai.google.dev/docs/gemini_api');
  });

  it('should fallback to model page when no spaces are available', async () => {
    const mockResponse = {
      data: {
        spaces: []
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await fetchDemoURL({
      modelId: 'test-model',
      provider: 'huggingface'
    });

    expect(result).toBe('https://huggingface.co/test-model');
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    const result = await fetchDemoURL({
      modelId: 'test-model',
      provider: 'huggingface'
    });

    expect(result).toBe('https://huggingface.co/test-model');
  });

  it('should throw error for unsupported provider', async () => {
    await expect(fetchDemoURL({
      modelId: 'test-model',
      provider: 'unsupported-provider' as any
    })).rejects.toThrow('Unsupported provider: unsupported-provider');
  });

  it('should handle different model types for OpenAI', async () => {
    const result = await fetchDemoURL({
      modelId: 'dall-e-3',
      provider: 'openai'
    });

    expect(result).toBe('https://platform.openai.com/docs/guides/images');
  });

  it('should handle different model types for Claude', async () => {
    const result = await fetchDemoURL({
      modelId: 'claude-3-sonnet',
      provider: 'claude'
    });

    expect(result).toBe('https://docs.anthropic.com/claude/docs/models-overview');
  });

  it('should handle different model types for Gemini', async () => {
    const result = await fetchDemoURL({
      modelId: 'gemini-pro-vision',
      provider: 'gemini'
    });

    expect(result).toBe('https://ai.google.dev/docs/gemini_api');
  });
}); 