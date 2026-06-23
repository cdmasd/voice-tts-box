package main

import (
	"context"
	"fmt"
	"os/exec"
	"Voice/backend/db"
	"Voice/backend/tts"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	db.InitDB()
	
	// Start daemon in background
	go func() {
		path := db.GetSetting("python_path")
		tts.StartDaemon(path)
	}()
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetPythonVenvPath() string {
	return db.GetSetting("python_path")
}

func (a *App) SetPythonVenvPath(path string) error {
	err := db.SetSetting("python_path", path)
	if err == nil {
		// restart daemon with new path
		go tts.StartDaemon(path)
	}
	return err
}

func (a *App) GenerateSpeech(text, voice string) (string, error) {
	return tts.GenerateAudio(text, voice)
}

func (a *App) ExportAudio(sourcePath, destPath string) error {
	cmd := exec.Command("ffmpeg", "-y", "-i", sourcePath, destPath)
	return cmd.Run()
}
