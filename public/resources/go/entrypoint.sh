#!/bin/bash
set -e

# Clone GitHub repository if GIT_REPO_URL is provided
if [ -n "$GIT_REPO_URL" ]; then
  echo "Cloning repository: $GIT_REPO_URL"
  cd /home/gouser/workspace
  if git clone "$GIT_REPO_URL" github-repo; then
    echo "Repository cloned successfully"
    cd github-repo
  else
    echo "Failed to clone repository, continuing with empty workspace"
  fi
else
  # Create a Go Hello World boilerplate if no repository is provided
  echo "No repository provided. Creating Go Hello World boilerplate..."
  cd /home/gouser/workspace
  
  # Create project directory
  mkdir -p hello-world
  cd hello-world
  
  # Initialize Go module
  go mod init hello-world
  
  # Create main.go with HTTP server
  cat > main.go << 'EOF'
package main

import (
    "fmt"
    "log"
    "net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World! 🚀\n")
    fmt.Fprintf(w, "Welcome to your Go workspace!\n")
}

func main() {
    http.HandleFunc("/", helloHandler)
    
    port := ":3000"
    fmt.Printf("Server is running on http://localhost%s\n", port)
    log.Fatal(http.ListenAndServe(port, nil))
}
EOF
  
  echo "Go Hello World project created successfully!"
  echo "To run the application:"
  echo "  cd hello-world"
  echo "  go run main.go"
fi

# Start code-server
echo "Starting code-server..."
exec code-server \
  --bind-addr 0.0.0.0:8080 \
  --user-data-dir /home/gouser/.vscode-settings \
  --extensions-dir /home/gouser/.vscode-extensions \
  --disable-telemetry \
  --auth none \
  /home/gouser/workspace
