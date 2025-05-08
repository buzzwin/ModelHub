# Building a ModelHub MCP: A Beginner's Guide to AI Model Integration

## Introduction

In this blog post, we'll explore how to build a ModelHub MCP (Model Context Protocol) server that helps AI agents discover, compare, and run different AI models. This project demonstrates how to integrate various AI model providers like HuggingFace, Replicate, Stability AI, OpenAI, Claude, and Gemini into a unified interface.

## What is ModelHub MCP?

ModelHub MCP is a server that provides a common interface for working with different AI models. Think of it as a translator that helps different AI systems talk to each other. It offers three main features:

1. **Model Inference**: Run AI models with a single, consistent interface
2. **Model Comparison**: Compare different models based on various metrics including cost and multimodal capabilities
3. **Demo Access**: Get easy access to model demos and documentation

## Project Structure

```
modelhub-mcp/
├── src/
│   ├── index.ts              # Main server file
│   ├── routes/              # API route handlers
│   │   ├── inference.ts     # Inference endpoint
│   │   ├── compare.ts       # Compare endpoint
│   │   └── demo.ts          # Demo URL endpoint
│   └── tools/
│       ├── inferenceRunner.ts # Handles model inference
│       ├── compareModels.ts   # Compares different models
│       └── fetchDemoURL.ts    # Gets demo URLs for models
├── public/                  # Static files for web interface
│   └── index.html          # Web UI
├── src/__tests__/          # Test files
├── package.json            # Project configuration
└── tsconfig.json          # TypeScript configuration
```

## Setting Up the Project

### 1. Initial Setup

First, we create a new Node.js project and install necessary dependencies:

```bash
npm init -y
npm install express dotenv axios typescript @types/node @types/express ts-node-dev
```

### 2. TypeScript Configuration

We use TypeScript for better type safety and developer experience. The `tsconfig.json` file configures TypeScript:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Core Components Explained

### 1. The Inference Runner

The `inferenceRunner.ts` file handles running AI models. Here's how it works:

```typescript
interface InferenceInput {
  modelId: string;
  provider:
    | "huggingface"
    | "replicate"
    | "stability"
    | "openai"
    | "claude"
    | "gemini";
  input: Record<string, any>;
  modality?: "text" | "image" | "audio" | "video" | "multimodal";
}

export async function inferenceRunner(input: InferenceInput) {
  const { modelId, provider, input: modelInput, modality } = input;

  switch (provider) {
    case "huggingface":
      return await runHuggingFaceInference(modelId, modelInput);
    case "replicate":
      return await runReplicateInference(modelId, modelInput);
    case "stability":
      return await runStabilityInference(modelId, modelInput);
    case "openai":
      return await runOpenAIInference(modelId, modelInput, modality);
    case "claude":
      return await runClaudeInference(modelId, modelInput, modality);
    case "gemini":
      return await runGeminiInference(modelId, modelInput, modality);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
```

This code:

- Takes a model ID, provider, input data, and optional modality
- Routes the request to the appropriate provider
- Returns the model's output

### 2. Model Comparison

The `compareModels.ts` file helps compare different models:

```typescript
interface CompareInput {
  models: string[];
  metrics: ("latency" | "modality" | "popularity" | "cost" | "capabilities")[];
}

interface ModelMetadata {
  id: string;
  modality: string;
  latency: number;
  popularity: number;
  tags: string[];
  cost: {
    input: number; // Cost per 1K tokens for input
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
      if (metric === "latency") result.latency = model.latency;
      if (metric === "modality") result.modality = model.modality;
      if (metric === "popularity") result.popularity = model.popularity;
      if (metric === "cost") result.cost = model.cost;
      if (metric === "capabilities") result.capabilities = model.capabilities;
    });
    return result;
  });
}
```

This code:

- Takes a list of models and metrics to compare
- Fetches metadata for each model, including cost and capabilities
- Returns a comparison based on the requested metrics

### 3. Demo URL Fetcher

The `fetchDemoURL.ts` file helps find demo URLs for models:

```typescript
interface DemoInput {
  modelId: string;
  provider:
    | "huggingface"
    | "replicate"
    | "stability"
    | "openai"
    | "claude"
    | "gemini";
}

export async function fetchDemoURL(input: DemoInput) {
  const { modelId, provider } = input;

  switch (provider) {
    case "huggingface":
      return await fetchHuggingFaceDemo(modelId);
    case "replicate":
      return await fetchReplicateDemo(modelId);
    case "stability":
      return await fetchStabilityDemo(modelId);
    case "openai":
      return await fetchOpenAIDemo(modelId);
    case "claude":
      return await fetchClaudeDemo(modelId);
    case "gemini":
      return await fetchGeminiDemo(modelId);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
```

This code:

- Takes a model ID and provider
- Fetches the appropriate demo URL
- Handles different providers' URL structures

## Web Interface

The project includes a modern web interface for testing all functionality. The UI is built with HTML, JavaScript, and Tailwind CSS, providing an intuitive way to interact with the API.

### Features

1. **Tabbed Interface**

   - Separate tabs for inference, model comparison, and demo URL fetching
   - Clean, modern design using Tailwind CSS
   - Responsive layout for desktop and mobile

2. **Inference Testing**

   - Provider selection (HuggingFace, OpenAI, Claude, Gemini)
   - Model ID input
   - Modality selection (text, image, audio, video, multimodal)
   - JSON input field for model-specific parameters
   - Real-time response display

3. **Model Comparison**

   - Multiple model input with comma separation
   - Metric selection via checkboxes
   - Comprehensive comparison results display
   - Support for all comparison metrics

4. **Demo URL Testing**
   - Provider selection
   - Model ID input
   - Direct link to model demos
   - Error handling for invalid inputs

### Implementation

The UI is implemented in `public/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ModelHub MCP Tester</title>
    <link
      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
      rel="stylesheet"
    />
  </head>
  <body>
    <!-- Tab navigation -->
    <div class="flex justify-center mb-8">
      <button class="tab-btn" data-tab="inference">Inference</button>
      <button class="tab-btn" data-tab="compare">Compare Models</button>
      <button class="tab-btn" data-tab="demo">Demo URL</button>
    </div>

    <!-- Tab content -->
    <div id="inference" class="tab-content active">
      <!-- Inference form -->
    </div>
    <div id="compare" class="tab-content">
      <!-- Comparison form -->
    </div>
    <div id="demo" class="tab-content">
      <!-- Demo URL form -->
    </div>
  </body>
</html>
```

### Usage

1. Start the server:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

3. Use the interface to:
   - Run model inference with different providers
   - Compare multiple models with various metrics
   - Fetch demo URLs for models

The UI provides immediate feedback and error handling, making it easy to test and debug the API functionality.

## Testing the Code

We use Jest for testing. Here's an example test for the model comparison:

```typescript
describe("compareModels", () => {
  it("should compare models with all metrics", async () => {
    const result = await compareModels({
      models: ["gpt-4", "claude-3-opus", "gemini-pro"],
      metrics: ["latency", "modality", "popularity", "cost", "capabilities"],
    });

    expect(result).toHaveLength(3);

    // Check OpenAI model
    expect(result[0]).toMatchObject({
      id: "gpt-4",
      modality: "text",
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
  });
});
```

## API Endpoints

The server provides three main endpoints:

1. **POST /inference**

   ```json
   {
     "modelId": "gpt-4",
     "provider": "openai",
     "input": {
       "prompt": "An astronaut riding a unicorn on Mars"
     },
     "modality": "text"
   }
   ```

2. **POST /compare**

   ```json
   {
     "models": ["gpt-4", "claude-3-opus", "gemini-pro"],
     "metrics": ["latency", "modality", "popularity", "cost", "capabilities"]
   }
   ```

3. **POST /demo**
   ```json
   {
     "modelId": "openai/whisper",
     "provider": "huggingface"
   }
   ```

## Environment Variables

The project uses environment variables for configuration:

```env
PORT=3000
HUGGINGFACE_API_KEY=your_huggingface_api_key
REPLICATE_API_KEY=your_replicate_api_key
STABILITY_API_KEY=your_stability_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_API_KEY=your_google_api_key
```

## Running the Project

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Run tests:
   ```bash
   npm test
   ```

## Key Learning Points

1. **TypeScript Interfaces**: We use interfaces to define the shape of our data
2. **Async/Await**: The code uses modern JavaScript async/await for handling asynchronous operations
3. **Error Handling**: Each component includes proper error handling
4. **Testing**: The project demonstrates unit testing and integration testing
5. **API Design**: Shows how to design a clean, consistent API
6. **Cost Management**: Demonstrates how to track and compare model costs
7. **Multimodal Support**: Shows how to handle different types of AI model inputs and outputs
8. **Web Interface**: Learn how to create a user-friendly testing interface

## Common Pitfalls and Solutions

1. **API Key Management**

   - Always use environment variables for API keys
   - Never commit API keys to version control

2. **Error Handling**

   - Always wrap API calls in try/catch blocks
   - Provide meaningful error messages

3. **Type Safety**

   - Use TypeScript interfaces to catch errors early
   - Validate input data before processing

4. **Cost Tracking**

   - Keep pricing information up to date
   - Handle different pricing models for different providers

5. **Multimodal Support**

   - Validate input/output modalities
   - Handle provider-specific modality requirements

6. **UI Development**
   - Use a CSS framework for consistent styling
   - Implement proper error handling and user feedback
   - Make the interface responsive for all devices

## Next Steps

1. Add more model providers
2. Implement caching for better performance
3. Add rate limiting
4. Enhance the web interface with more features
5. Add more metrics for model comparison
6. Implement cost optimization strategies
7. Add support for more modalities
8. Add user authentication for the web interface

## Conclusion

This project demonstrates how to create a unified interface for different AI models. It shows important concepts like:

- API integration
- Type safety
- Error handling
- Testing
- Project structure
- Cost management
- Multimodal support
- Web interface development

By understanding this code, you'll have a solid foundation for building more complex AI integration projects.

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [HuggingFace API Documentation](https://huggingface.co/docs/api-inference/index)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Anthropic API Documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Google AI API Documentation](https://ai.google.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
