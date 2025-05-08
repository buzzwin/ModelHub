import axios from 'axios';

interface CompareInput {
  models: string[];
  metrics: ('latency' | 'modality' | 'popularity')[];
}

interface ModelMetadata {
  id: string;
  modality: string;
  latency: number;
  popularity: number;
  tags: string[];
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
  const comparison = modelMetadata.map((model) => {
    const result: Partial<ModelMetadata> = { id: model.id };
    
    metrics.forEach((metric) => {
      if (metric === 'latency') result.latency = model.latency;
      if (metric === 'modality') result.modality = model.modality;
      if (metric === 'popularity') result.popularity = model.popularity;
    });

    return result;
  });

  return comparison;
}

async function fetchModelMetadata(modelId: string): Promise<Omit<ModelMetadata, 'id'>> {
  // This is a simplified implementation. In a real system, you would:
  // 1. Check multiple sources (HuggingFace, Replicate, etc.)
  // 2. Cache results
  // 3. Handle rate limiting
  // 4. Implement proper error handling
  
  try {
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
    };
  } catch (error) {
    console.error(`Error fetching metadata for model ${modelId}:`, error);
    return {
      modality: 'unknown',
      latency: 0,
      popularity: 0,
      tags: [],
    };
  }
} 