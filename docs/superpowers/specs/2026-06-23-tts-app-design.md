# Desktop TTS App Design Spec

## Overview
A desktop Text-to-Speech application built using Wails v2 (Go + React). It uses the Kokoro TTS engine running locally via Python to generate audio from text.

## Features & Scope
- **Voice Selection**: Built-in Kokoro voices (e.g., af_heart, af_bella, am_adam).
- **Text to Speech**: Input text, generate audio, play/pause/stop controls.
- **Export**: Save the generated audio to MP3 or WAV using ffmpeg.
- **Settings**: Configurable path to the Python executable/virtual environment.

## UI/UX Design
- **Layout**: Split-pane layout.
  - Left Sidebar: Voice selection list, settings button (to configure Python venv path).
  - Right Main Area: Large text input area, playback controls (play, pause, stop) at the bottom, and an export button.
- **Styling**: Modern, premium feel with Tailwind CSS. Dark mode aesthetics, glassmorphism, and micro-animations for interactive elements.

## Architecture
- **Frontend**: React + Tailwind CSS. Calls Go backend functions via Wails bindings.
- **Backend (Go)**:
  - Manages SQLite database for storing user settings and recently used voices.
  - Handles the file system (temporary WAV files, exporting).
  - Spawns and manages a long-running Python subprocess.
  - Calls ffmpeg for exporting to MP3/WAV.
- **Python Subprocess (Kokoro Daemon)**:
  - Runs a simple JSON-RPC loop over standard I/O (stdin/stdout) or simple line-based JSON commands.
  - Keeps the `kokoro-onnx` model loaded in memory for fast generation.
  - Accepts `text` and `voice` parameters, generates audio, and saves it to a specified temporary file, returning success/failure.
