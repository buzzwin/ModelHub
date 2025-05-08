import axios from 'axios';

interface DemoInput {
  modelId: string;
  provider: 'huggingface' | 'replicate' | 'stability';
}

export async function fetchDemoURL(input: DemoInput) {
  const { modelId, provider } = input;

  switch (provider) {
    case 'huggingface':
      return await fetchHuggingFaceDemo(modelId);
    case 'replicate':
      return await fetchReplicateDemo(modelId);
    case 'stability':
      return await fetchStabilityDemo(modelId);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

async function fetchHuggingFaceDemo(modelId: string) {
  try {
    const response = await axios.get(
      `https://huggingface.co/api/models/${modelId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    // HuggingFace Spaces demo URL
    const spaceUrl = response.data.spaces?.[0]?.url;
    if (spaceUrl) {
      return { demoUrl: spaceUrl };
    }

    // Fallback to model page
    return { demoUrl: `https://huggingface.co/${modelId}` };
  } catch (error) {
    console.error(`Error fetching HuggingFace demo for ${modelId}:`, error);
    return { demoUrl: `https://huggingface.co/${modelId}` };
  }
}

async function fetchReplicateDemo(modelId: string) {
  try {
    const response = await axios.get(
      `https://api.replicate.com/v1/models/${modelId}`,
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
        },
      }
    );

    return { demoUrl: response.data.url || `https://replicate.com/${modelId}` };
  } catch (error) {
    console.error(`Error fetching Replicate demo for ${modelId}:`, error);
    return { demoUrl: `https://replicate.com/${modelId}` };
  }
}

async function fetchStabilityDemo(modelId: string) {
  // Stability AI doesn't have a direct demo URL API
  // Return the model documentation page
  return { demoUrl: 'https://platform.stability.ai/docs/api-reference' };
} 