# Hacktoberfest 2026

## Install Ollama

See [ollama.com](https://ollama.com/) for installers. 

### macOS

1. Run: `curl -fsSL https://ollama.com/install.sh | sh`  
   Or download **Ollama.dmg** from the site and open it.
2. Check: `ollama --version`

### Ubuntu

1. Run: `curl -fsSL https://ollama.com/install.sh | sh`
2. Check: `ollama --version`

### RHEL

1. Install `curl` if needed: `sudo dnf install -y curl`
2. Run: `curl -fsSL https://ollama.com/install.sh | sh`
3. Check: `ollama --version`

## Try the models

Use this sample ticket text at each interactive prompt:

```text
I was charged twice for my subscription.
```

### Base model (Qwen)

```bash
ollama run qwen2.5:7b
```

Paste the sample text when Ollama asks for input.

### Fine-tuned model (Hugging Face)

```bash
ollama run hf.co/anandshivam44/jarvis-ticket-classifier:F16
```

Paste the same sample text at the prompt.

## Google Colab

1. Open the [Jarvis ticket classifier notebook](https://colab.research.google.com/drive/10-rLaRM8wWc7RVSAiwic-Rs52YeaD0wx?usp=sharing).
2. **File → Save a copy in Drive** so you can run it yourself.
3. Run each cell in order; when a step asks for input, use the sample ticket text above.
