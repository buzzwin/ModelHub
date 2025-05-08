# ModelHub

Here’s a full GitHub-ready `README.md` for your **ModelHub MCP** server:

---

````markdown
# 🧠 ModelHub MCP

**One protocol to find, compare, and run any AI model.**  
An open MCP server that aggregates free/public AI tools like HuggingFace Spaces, Replicate, and Stability SDKs into a unified interface for agents.

---

## 🚀 What is ModelHub MCP?

ModelHub MCP is a **Model Context Protocol (MCP) server** that lets AI agents:

- 🔍 **Discover** models from platforms like HuggingFace, Replicate, Stability AI, and more.
- ⚖️ **Compare** model capabilities and performance via unified metadata.
- 🧪 **Run inference** instantly with a consistent `inferenceRunner` tool.
- 📎 **Fetch live demo links**, usage stats, tags, and model descriptions.

Perfect for:

- 🤖 LLM agents needing external model access
- 🧪 AI researchers and builders testing models
- 🧰 Developer tools looking to integrate model search & execution

---

## 🛠 Tools Exposed

### `inferenceRunner`

Runs inference on a given model (HuggingFace, Replicate, etc.) with optional inputs.

```json
{
  "modelId": "stability-ai/sdxl",
  "provider": "huggingface",
  "input": {
    "prompt": "An astronaut riding a unicorn on Mars"
  }
}
```
````

### `compareModels`

Compares multiple models based on tags, modality (text, image, audio), latency, and cost.

```json
{
  "models": ["stability-ai/sdxl", "runwayml/stable-diffusion-v1-5"],
  "metrics": ["latency", "modality", "popularity"]
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
- Access to HuggingFace Hub API & Replicate API (optional)
- Axios, Express, dotenv, and other standard libraries

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
