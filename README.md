# 🧠 ModelHub MCP

**One protocol to find, compare, and run any AI model.**  
An open MCP server that aggregates AI tools from HuggingFace, Replicate, Stability AI, OpenAI, Claude, and Gemini into a unified interface for agents.

---

## 🚀 What is ModelHub MCP?

ModelHub MCP is a **Model Context Protocol (MCP) server** that lets AI agents:

- 🔍 **Discover** models from platforms like HuggingFace, Replicate, Stability AI, OpenAI, Claude, and Gemini.
- ⚖️ **Compare** model capabilities, performance, cost, and multimodal features via unified metadata.
- 🧪 **Run inference** instantly with a consistent `inferenceRunner` tool.
- 📎 **Fetch live demo links**, usage stats, tags, and model descriptions.

Perfect for:

- 🤖 LLM agents needing external model access
- 🧪 AI researchers and builders testing models
- 🧰 Developer tools looking to integrate model search & execution
- 💰 Cost optimization and model selection

---

## 🛠 Tools Exposed

### `inferenceRunner`

Runs inference on a given model with optional inputs and modality specification.

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

### `compareModels`

Compares multiple models based on various metrics including cost and multimodal capabilities.

```json
{
  "models": ["gpt-4", "claude-3-opus", "gemini-pro"],
  "metrics": ["latency", "modality", "popularity", "cost", "capabilities"]
}
```

### `fetchDemoURL`

Returns a public link to test the model (if available).

```json
{
  "modelId": "openai/whisper",
  "provider": "huggingface"
}
```

---

## 🖥️ Web Interface

ModelHub MCP includes a modern web interface for testing all functionality. The UI is built with HTML, JavaScript, and Tailwind CSS, providing an intuitive way to:

- Run model inference with different providers and modalities
- Compare multiple models with various metrics
- Fetch demo URLs for models

To access the UI:

1. Start the server:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

The interface features:

- Clean, modern design with Tailwind CSS
- Tabbed interface for different functionalities
- Real-time API response display
- Input validation and error handling
- Responsive layout for desktop and mobile

---

## 🌐 Protocol & Transport

- **Protocol**: [Model Context Protocol (MCP)](https://mcp.so)
- **Transport**: `sse` (for remote access)
- **Hosted URL**: `https://modelhub-mcp.yourdomain.com/sse`

---

## 📦 Install & Run

```bash
git clone https://github.com/yourusername/modelhub-mcp.git
cd modelhub-mcp
npm install
npm run dev
```

---

## 🧩 Dependencies

- Node.js 18+
- MCP SDK for TypeScript
- Access to various AI provider APIs:
  - HuggingFace Hub API
  - Replicate API
  - Stability AI API
  - OpenAI API
  - Anthropic API (Claude)
  - Google AI API (Gemini)
- Axios, Express, dotenv, and other standard libraries

---

## 🔑 Environment Variables

```env
PORT=3000
HUGGINGFACE_API_KEY=your_huggingface_api_key
REPLICATE_API_KEY=your_replicate_api_key
STABILITY_API_KEY=your_stability_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_API_KEY=your_google_api_key
```

---

## 🤝 Contribute

We welcome model sources, new protocols, and feature ideas. Open a PR or start a discussion!

---

## 📜 License

MIT License. Attribution encouraged.

---

## 🧠 Credits

Inspired by the work of the [Model Context Protocol](https://mcp.so) community.

Built by \Vijayvergias.
