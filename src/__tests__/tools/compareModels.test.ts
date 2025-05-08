import axios from 'axios';
import { compareModels } from '../../tools/compareModels';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('compareModels', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should compare models with all metrics', async () => {
    const mockResponse = {
      data: {
        pipeline_tag: 'text-generation',
        downloads: 1000,
        likes: 500,
        tags: ['llm', 'text-generation'],
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await compareModels({
      models: ['gpt-4', 'claude-3-opus', 'gemini-pro'],
      metrics: ['latency', 'modality', 'popularity', 'cost', 'capabilities'],
    });

    expect(result).toHaveLength(3);
    
    // Check OpenAI model
    expect(result[0]).toMatchObject({
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
    });

    // Check Claude model
    expect(result[1]).toMatchObject({
      id: 'claude-3-opus',
      modality: 'text',
      cost: {
        input: 0.015,
        output: 0.075,
      },
      capabilities: {
        text: true,
        image: true,
        audio: false,
        video: false,
        multimodal: true,
      },
    });

    // Check Gemini model
    expect(result[2]).toMatchObject({
      id: 'gemini-pro',
      modality: 'multimodal',
      cost: {
        input: 0.00025,
        output: 0.0005,
      },
      capabilities: {
        text: true,
        image: true,
        audio: false,
        video: false,
        multimodal: true,
      },
    });
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    const result = await compareModels({
      models: ['unknown-model'],
      metrics: ['latency', 'modality', 'popularity', 'cost', 'capabilities'],
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'unknown-model',
      modality: 'unknown',
      latency: 0,
      popularity: 0,
      cost: {
        input: 0,
        output: 0,
      },
      capabilities: {
        text: false,
        image: false,
        audio: false,
        video: false,
        multimodal: false,
      },
    });
  });

  it('should handle HuggingFace models correctly', async () => {
    const mockResponse = {
      data: {
        pipeline_tag: 'text-generation',
        downloads: 1000,
        likes: 500,
        tags: ['llm', 'text-generation', 'multimodal'],
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await compareModels({
      models: ['bert-base-uncased'],
      metrics: ['latency', 'modality', 'popularity', 'cost', 'capabilities'],
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'bert-base-uncased',
      modality: 'text-generation',
      cost: {
        input: 0,
        output: 0,
      },
      capabilities: {
        text: true,
        image: false,
        audio: false,
        video: false,
        multimodal: true,
      },
    });
  });

  it('should handle partial metrics request', async () => {
    const result = await compareModels({
      models: ['gpt-4'],
      metrics: ['cost', 'capabilities'],
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'gpt-4',
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
    });
    expect(result[0].latency).toBeUndefined();
    expect(result[0].modality).toBeUndefined();
    expect(result[0].popularity).toBeUndefined();
  });
}); 