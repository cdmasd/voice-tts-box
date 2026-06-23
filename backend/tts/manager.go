package tts

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"sync"
)

var (
	cmd     *exec.Cmd
	stdin   io.WriteCloser
	scanner *bufio.Scanner
	mu      sync.Mutex
)

func StartDaemon(pythonPath string) error {
	mu.Lock()
	defer mu.Unlock()

	if cmd != nil && cmd.Process != nil {
		cmd.Process.Kill()
	}

	exe := "python"
	if pythonPath != "" {
		exe = filepath.Join(pythonPath, "Scripts", "python.exe")
		if _, err := os.Stat(exe); os.IsNotExist(err) {
			exe = pythonPath // fallback if they provided the exact executable
		}
	}

	daemonPath := filepath.Join("backend", "tts", "daemon.py")
	cmd = exec.Command(exe, daemonPath)
	
	inPipe, err := cmd.StdinPipe()
	if err != nil {
		return err
	}
	
	outPipe, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}
	
	cmd.Stderr = os.Stderr // pipe stderr for debugging
	
	if err := cmd.Start(); err != nil {
		return err
	}
	
	stdin = inPipe
	scanner = bufio.NewScanner(outPipe)
	
	// Read the ready/error state
	if scanner.Scan() {
		var res map[string]interface{}
		json.Unmarshal(scanner.Bytes(), &res)
		if res["status"] == "error" {
			return fmt.Errorf("daemon failed to start: %v", res["message"])
		}
	}

	return nil
}

func GenerateAudio(text, voice string) (string, error) {
	mu.Lock()
	defer mu.Unlock()

	if cmd == nil || cmd.Process == nil {
		return "", fmt.Errorf("daemon not running")
	}

	// create a temp file path
	tempDir := os.TempDir()
	outPath := filepath.Join(tempDir, "kokoro_temp.wav")

	req := map[string]string{
		"text":     text,
		"voice":    voice,
		"out_path": outPath,
	}
	reqBytes, _ := json.Marshal(req)
	reqBytes = append(reqBytes, '\n')
	
	_, err := stdin.Write(reqBytes)
	if err != nil {
		return "", err
	}

	if scanner.Scan() {
		var res map[string]interface{}
		json.Unmarshal(scanner.Bytes(), &res)
		if res["status"] == "success" {
			return outPath, nil
		} else {
			return "", fmt.Errorf("generation error: %v", res["message"])
		}
	}
	
	if err := scanner.Err(); err != nil {
		return "", err
	}
	
	return "", fmt.Errorf("daemon closed unexpectedly")
}
