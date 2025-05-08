import axios from 'axios';

interface InferenceInput {
  modelId: string;
  provider: 'huggingface' | 'replicate' | 'stability' | 'openai' | 'claude' | 'gemini';
  input: Record<string, any>;
  modality?: 'text' | 'image' | 'audio' | 'video' | 'multimodal';
}

export async function inferenceRunner(input: InferenceInput) {
  const { modelId, provider, input: modelInput, modality } = input;

  switch (provider) {
    case 'huggingface':
      return await runHuggingFaceInference(modelId, modelInput);
    case 'replicate':
      return await runReplicateInference(modelId, modelInput);
    case 'stability':
      return await runStabilityInference(modelId, modelInput);
    case 'openai':
      return await runOpenAIInference(modelId, modelInput, modality);
    case 'claude':
      return await runClaudeInference(modelId, modelInput, modality);
    case 'gemini':
      return await runGeminiInference(modelId, modelInput, modality);
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

async function runOpenAIInference(modelId: string, input: Record<string, any>, modality?: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API key not configured');

  let endpoint = 'https://api.openai.com/v1/chat/completions';
  if (modality === 'image') {
    endpoint = 'https://api.openai.com/v1/images/generations';
  } else if (modality === 'audio') {
    endpoint = 'https://api.openai.com/v1/audio/transcriptions';
  }

  const response = await axios.post(
    endpoint,
    {
      model: modelId,
      ...input,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

async function runClaudeInference(modelId: string, input: Record<string, any>, modality?: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Anthropic API key not configured');

  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: modelId,
      ...input,
    },
    {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

async function runGeminiInference(modelId: string, input: Record<string, any>, modality?: string) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error('Google API key not configured');

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`,
    input,
    {
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
} 