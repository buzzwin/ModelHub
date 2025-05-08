import axios from 'axios';

interface InferenceInput {
  modelId: string;
  provider: 'huggingface' | 'replicate' | 'stability';
  input: Record<string, any>;
}

export async function inferenceRunner(input: InferenceInput) {
  const { modelId, provider, input: modelInput } = input;

  switch (provider) {
    case 'huggingface':
      return await runHuggingFaceInference(modelId, modelInput);
    case 'replicate':
      return await runReplicateInference(modelId, modelInput);
    case 'stability':
      return await runStabilityInference(modelId, modelInput);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

async function runHuggingFaceInference(modelId: string, input: Record<string, any>) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error('HuggingFace API key not configured');

  const response = await axios.post(
    `https://api-inference.huggingface.co/models/${modelId}`,
    input,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

async function runReplicateInference(modelId: string, input: Record<string, any>) {
  const apiKey = process.env.REPLICATE_API_KEY;
  if (!apiKey) throw new Error('Replicate API key not configured');

  const response = await axios.post(
    'https://api.replicate.com/v1/predictions',
    {
      version: modelId,
      input,
    },
    {
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

async function runStabilityInference(modelId: string, input: Record<string, any>) {
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) throw new Error('Stability API key not configured');

  const response = await axios.post(
    'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    input,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
} 