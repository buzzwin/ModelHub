import axios from 'axios';
import { compareModels } from '../../tools/compareModels';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('compareModels', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should compare models successfully', async () => {
    const mockResponse = {
      data: {
        pipeline_tag: 'text-generation',
        downloads: 1000,
        likes: 500,
        tags: ['nlp', 'text']
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const input = {
      models: ['test-model-1'],
      metrics: ['latency', 'modality', 'popularity']
    };

    const result = await compareModels(input);
    expect(result).toEqual([
      {
        id: 'test-model-1',
        latency: 1000,
        modality: 'text-generation',
        popularity: 500
      }
    ]);
  });

  it('should handle multiple models', async () => {
    const mockResponse1 = {
      data: {
        pipeline_tag: 'text-generation',
        downloads: 1000,
        likes: 500,
        tags: ['nlp']
      }
    };
    const mockResponse2 = {
      data: {
        pipeline_tag: 'image-generation',
        downloads: 2000,
        likes: 1000,
        tags: ['vision']
      }
    };
    mockedAxios.get
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);

    const input = {
      models: ['test-model-1', 'test-model-2'],
      metrics: ['latency', 'modality', 'popularity']
    };

    const result = await compareModels(input);
    expect(result).toEqual([
      {
        id: 'test-model-1',
        latency: 1000,
        modality: 'text-generation',
        popularity: 500
      },
      {
        id: 'test-model-2',
        latency: 2000,
        modality: 'image-generation',
        popularity: 1000
      }
    ]);
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    const input = {
      models: ['test-model-1'],
      metrics: ['latency', 'modality', 'popularity']
    };

    const result = await compareModels(input);
    expect(result).toEqual([
      {
        id: 'test-model-1',
        latency: 0,
        modality: 'unknown',
        popularity: 0
      }
    ]);
  });
}); 