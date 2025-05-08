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
      input: { prompt: 'test prompt' },
    };

    const result = await inferenceRunner(input);
    expect(result).toEqual({ result: 'test result' });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('huggingface.co'),
      input.input,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('Bearer'),
        }),
      })
    );
  });

  it('should run OpenAI inference successfully', async () => {
    const mockResponse = { data: { choices: [{ text: 'test response' }] } };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const input = {
      modelId: 'gpt-4',
      provider: 'openai',
      input: { prompt: 'test prompt' },
      modality: 'text',
    };

    const result = await inferenceRunner(input);
    expect(result).toEqual({ choices: [{ text: 'test response' }] });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        model: 'gpt-4',
        prompt: 'test prompt',
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('Bearer'),
        }),
      })
    );
  });

  it('should run Claude inference successfully', async () => {
    const mockResponse = { data: { content: 'test response' } };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const input = {
      modelId: 'claude-3-opus',
      provider: 'claude',
      input: { prompt: 'test prompt' },
      modality: 'text',
    };

    const result = await inferenceRunner(input);
    expect(result).toEqual({ content: 'test response' });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({
        model: 'claude-3-opus',
        prompt: 'test prompt',
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-api-key': expect.any(String),
          'anthropic-version': '2023-06-01',
        }),
      })
    );
  });

  it('should run Gemini inference successfully', async () => {
    const mockResponse = { data: { candidates: [{ content: 'test response' }] } };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const input = {
      modelId: 'gemini-pro',
      provider: 'gemini',
      input: { prompt: 'test prompt' },
      modality: 'text',
    };

    const result = await inferenceRunner(input);
    expect(result).toEqual({ candidates: [{ content: 'test response' }] });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('generativelanguage.googleapis.com'),
      expect.objectContaining({
        prompt: 'test prompt',
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-goog-api-key': expect.any(String),
        }),
      })
    );
  });

  it('should handle OpenAI image generation', async () => {
    const mockResponse = { data: { data: [{ url: 'test-image-url' }] } };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const input = {
      modelId: 'dall-e-3',
      provider: 'openai',
      input: { prompt: 'test image prompt' },
      modality: 'image',
    };

    const result = await inferenceRunner(input);
    expect(result).toEqual({ data: [{ url: 'test-image-url' }] });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.openai.com/v1/images/generations',
      expect.objectContaining({
        model: 'dall-e-3',
        prompt: 'test image prompt',
      }),
      expect.any(Object)
    );
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

    const input = {
      modelId: 'test-model',
      provider: 'huggingface',
      input: { prompt: 'test prompt' },
    };

    await expect(inferenceRunner(input)).rejects.toThrow('API Error');
  });

  it('should throw error for unsupported provider', async () => {
    const input = {
      modelId: 'test-model',
      provider: 'unsupported-provider' as any,
      input: { prompt: 'test prompt' },
    };

    await expect(inferenceRunner(input)).rejects.toThrow('Unsupported provider: unsupported-provider');
  });

  it('should throw error when API key is not configured', async () => {
    const originalEnv = process.env;
    process.env = { ...originalEnv, HUGGINGFACE_API_KEY: undefined };

    const input = {
      modelId: 'test-model',
      provider: 'huggingface',
      input: { prompt: 'test prompt' },
    };

    await expect(inferenceRunner(input)).rejects.toThrow('HuggingFace API key not configured');

    process.env = originalEnv;
  });
}); 