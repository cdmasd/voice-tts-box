import sys
import json
import os
import urllib.request
import soundfile as sf
from kokoro_onnx import Kokoro

MODEL_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/kokoro-v0_19.onnx"
VOICES_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/voices.bin"
MODEL_FILE = "kokoro-v0_19.onnx"
VOICES_FILE = "voices.bin"

def download_file(url, dest):
    print(json.dumps({"status": "info", "message": f"Downloading {dest}..."}), flush=True)
    urllib.request.urlretrieve(url, dest)
    print(json.dumps({"status": "info", "message": f"Downloaded {dest}."}), flush=True)

def main():
    try:
        # Download models if they don't exist
        if not os.path.exists(MODEL_FILE):
            download_file(MODEL_URL, MODEL_FILE)
        if not os.path.exists(VOICES_FILE):
            download_file(VOICES_URL, VOICES_FILE)

        kokoro = Kokoro(MODEL_FILE, VOICES_FILE)
    except Exception as e:
        print(json.dumps({"status": "error", "message": f"Failed to load model: {e}"}), flush=True)
        return

    print(json.dumps({"status": "ready"}), flush=True)

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
            text = req.get("text", "")
            voice = req.get("voice", "af_heart")
            out_path = req.get("out_path", "temp.wav")
            
            # Generate audio
            samples, sample_rate = kokoro.create(text, voice=voice, speed=1.0, lang="en-us")
            sf.write(out_path, samples, sample_rate)
            
            print(json.dumps({"status": "success", "out_path": out_path}), flush=True)
        except Exception as e:
            print(json.dumps({"status": "error", "message": str(e)}), flush=True)

if __name__ == "__main__":
    main()
