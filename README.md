# 🎙️ Voice - Desktop Text-to-Speech App

A modern, high-performance Desktop Text-to-Speech (TTS) application built with **Wails v2**, **React**, **Tailwind CSS**, and **Kokoro-ONNX**. 

![Voice App UI](build/appicon.png) <!-- Replace with actual screenshot when available -->

## ✨ Features
- **Local AI Processing**: Uses the powerful Kokoro-ONNX model running completely locally on your CPU. No cloud API required, ensuring absolute privacy.
- **Lightning Fast**: Go backend spawns a continuous Python daemon, keeping the AI model loaded in memory for near-instant speech generation.
- **Modern UI**: Built with React and Tailwind CSS featuring a sleek dark mode, glassmorphism, and a split-pane layout.
- **18 Built-in Voices**: Choose from a wide selection of high-quality English voices (e.g. `af_heart`, `am_adam`, `af_bella`, and more).
- **Export Capabilities**: Seamlessly export generated speech to MP3 or WAV via integrated FFmpeg.
- **Configurable Environments**: Manage your Python virtual environment path directly from the app settings.

## 🛠️ Architecture
- **Frontend**: React (TypeScript), Vite, Tailwind CSS v3.
- **Backend**: Go (Wails v2), modernc.org/sqlite for settings management.
- **TTS Engine**: Python 3, `kokoro-onnx`, `soundfile`.
- **Inter-process Communication**: Standard input/output JSON-RPC between Go and Python daemon.

## 🚀 Getting Started

### Prerequisites
1. **Go 1.25+**
2. **Node.js & npm**
3. **Python 3.10+** (and a virtual environment)
4. **Wails CLI** (`go install github.com/wailsapp/wails/v2/cmd/wails@latest`)
5. **FFmpeg** (needs to be installed and available in your system PATH)

### 1. Setup Python Environment
Create a virtual environment inside the project directory and install the required dependencies:
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install kokoro-onnx soundfile
```

> **Note**: The Kokoro-ONNX model weights and voice pack (~80MB) will be downloaded automatically by the Python daemon on the first run.

### 2. Run in Development Mode
Launch the Wails development server which provides hot-reloading for both the frontend and backend:
```bash
wails dev
```

*On the first run, make sure to click "⚙️ Settings" and input your Python virtual environment path (e.g., `E:\Voice\venv`).*

### 3. Build for Production
To build a standalone executable file for Windows:
```bash
wails build
```
The compiled executable will be available in the `build/bin` directory.

## 📄 License
This project is open-source and available under the MIT License. The underlying Kokoro TTS engine is also released under the MIT license.
