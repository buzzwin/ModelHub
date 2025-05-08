import axios from 'axios';

interface CompareInput {
  models: string[];
  metrics: ('latency' | 'modality' | 'popularity' | 'cost' | 'capabilities')[];
}

interface ModelMetadata {
  id: string;
  modality: string;
  latency: number;
  popularity: number;
  tags: string[];
  cost: {
    input: number;  // Cost per 1K tokens for input
    output: number; // Cost per 1K tokens for output
  };
  capabilities: {
    text: boolean;
    image: boolean;
    audio: boolean;
    video: boolean;
    multimodal: boolean;
  };
}

export async function compareModels(input: CompareInput) {
  const { models, metrics } = input;
  
  // Fetch metadata for each model
  const modelMetadata = await Promise.all(
    models.map(async (modelId) => {
      const metadata = await fetchModelMetadata(modelId);
      return {
        id: modelId,
        ...metadata,
      };
    })
  );

  // Compare models based on requested metrics
  return modelMetadata.map((model) => {
    const result: Partial<ModelMetadata> = { id: model.id };
    
    metrics.forEach((metric) => {
      if (metric === 'latency') result.latency = model.latency;
      if (metric === 'modality') result.modality = model.modality;
      if (metric === 'popularity') result.popularity = model.popularity;
      if (metric === 'cost') result.cost = model.cost;
      if (metric === 'capabilities') result.capabilities = model.capabilities;
    });

    return result;
  });
}

async function fetchModelMetadata(modelId: string): Promise<Omit<ModelMetadata, 'id'>> {
  // This is a simplified implementation. In a real system, you would:
  // 1. Check multiple sources (HuggingFace, Replicate, etc.)
  // 2. Cache results
  // 3. Handle rate limiting
  // 4. Implement proper error handling
  
  try {
    // Try to determine the provider from the model ID
    const provider = determineProvider(modelId);
    
    switch (provider) {
      case 'huggingface':
        return await fetchHuggingFaceMetadata(modelId);
      case 'openai':
        return await fetchOpenAIMetadata(modelId);
      case 'claude':
        return await fetchClaudeMetadata(modelId);
      case 'gemini':
        return await fetchGeminiMetadata(modelId);
      default:
        return getDefaultMetadata();
    }
  } catch (error) {
    console.error(`Error fetching metadata for model ${modelId}:`, error);
    return getDefaultMetadata();
  }
}

function determineProvider(modelId: string): string {
  if (modelId.startsWith('gpt-') || modelId.startsWith('text-')) return 'openai';
  if (modelId.startsWith('claude-')) return 'claude';
  if (modelId.startsWith('gemini-')) return 'gemini';
  return 'huggingface';
}

async function fetchHuggingFaceMetadata(modelId: string): Promise<Omit<ModelMetadata, 'id'>> {
  const response = await axios.get(
    `https://huggingface.co/api/models/${modelId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      },
    }
  );

  return {
    modality: response.data.pipeline_tag || 'unknown',
    latency: response.data.downloads || 0,
    popularity: response.data.likes || 0,
    tags: response.data.tags || [],
    cost: {
      input: 0,  // HuggingFace models are free
      output: 0,
    },
    capabilities: {
      text: response.data.pipeline_tag === 'text-generation',
      image: response.data.pipeline_tag === 'image-generation',
      audio: response.data.pipeline_tag === 'audio-to-text',
      video: false,
      multimodal: response.data.tags?.includes('multimodal') || false,
    },
  };
}

async function fetchOpenAIMetadata(modelId: string): Promise<Omit<ModelMetadata, 'id'>> {
  // OpenAI pricing and capabilities
  const pricing = {
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'gpt-3.5-turbo': { input: 0.001, output: 0.002 },
  };

  const capabilities = {
    'gpt-4': { text: true, image: true, audio: false, video: false, multimodal: true },
    'gpt-4-turbo': { text: true, image: true, audio: false, video: false, multimodal: true },
    'gpt-3.5-turbo': { text: true, image: false, audio: false, video: false, multimodal: false },
  };

  return {
    modality: 'text',
    latency: 100, // Example value
    popularity: 1000, // Example value
    tags: ['openai', 'llm'],
    cost: pricing[modelId] || { input: 0, output: 0 },
    capabilities: capabilities[modelId] || {
      text: true,
      image: false,
      audio: false,
      video: false,
      multimodal: false,
    },
  };
}

async function fetchClaudeMetadata(modelId: string): Promise<Omit<ModelMetadata, 'id'>> {
  // Claude pricing and capabilities
  const pricing = {
    'claude-3-opus': { input: 0.015, output: 0.075 },
    'claude-3-sonnet': { input: 0.003, output: 0.015 },
    'claude-3-haiku': { input: 0.00025, output: 0.00125 },
  };

  return {
    modality: 'text',
    latency: 80, // Example value
    popularity: 800, // Example value
    tags: ['anthropic', 'llm'],
    cost: pricing[modelId] || { input: 0, output: 0 },
    capabilities: {
      text: true,
      image: true,
      audio: false,
      video: false,
      multimodal: true,
    },
  };
}

async function fetchGeminiMetadata(modelId: string): Promise<Omit<ModelMetadata, 'id'>> {
  // Gemini pricing and capabilities
  const pricing = {
    'gemini-pro': { input: 0.00025, output: 0.0005 },
    'gemini-pro-vision': { input: 0.00025, output: 0.0005 },
  };

  return {
    modality: 'multimodal',
    latency: 60, // Example value
    popularity: 600, // Example value
    tags: ['google', 'llm'],
    cost: pricing[modelId] || { input: 0, output: 0 },
    capabilities: {
      text: true,
      image: true,
      audio: false,
      video: false,
      multimodal: true,
    },
  };
}

function getDefaultMetadata(): Omit<ModelMetadata, 'id'> {
  return {
    modality: 'unknown',
    latency: 0,
    popularity: 0,
    tags: [],
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
  };
} 