#!/bin/bash
set -e

# Clone GitHub repository if GIT_REPO_URL is provided
if [ -n "$GIT_REPO_URL" ]; then
  echo "Cloning repository: $GIT_REPO_URL"
  cd /home/rustuser/workspace
  if git clone "$GIT_REPO_URL" github-repo; then
    echo "Repository cloned successfully"
    cd github-repo
  else
    echo "Failed to clone repository, continuing with empty workspace"
  fi
else
  # Create a Rust Hello World boilerplate if no repository is provided
  cd /home/rustuser/workspace
  
  if [ ! -d "hello-world" ]; then
    echo "No repository provided. Creating Rust Hello World boilerplate..."
    
    # Create a new binary project
    cargo new hello-world
    cd hello-world
    
    # Replace main.rs with HTTP server example
    cat > src/main.rs << 'EOF'
use std::io::prelude::*;
use std::net::TcpListener;
use std::net::TcpStream;

fn main() {
    let listener = TcpListener::bind("0.0.0.0:8000").unwrap();
    println!("🚀 Rust HTTP server running on http://localhost:8000");
    println!("Press Ctrl+C to stop");

    for stream in listener.incoming() {
        let stream = stream.unwrap();
        handle_connection(stream);
    }
}

fn handle_connection(mut stream: TcpStream) {
    let mut buffer = [0; 1024];
    stream.read(&mut buffer).unwrap();

    let response = "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n\
        <!DOCTYPE html>\
        <html>\
        <head><title>Rust Hello World</title></head>\
        <body>\
        <h1>Hello, World! 🦀</h1>\
        <p>Welcome to your Rust workspace!</p>\
        <p>This is a simple HTTP server built with Rust.</p>\
        </body>\
        </html>";

    stream.write_all(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}
EOF
    
    echo "Rust Hello World project created successfully!"
    echo "To run the application:"
    echo "  cd hello-world"
    echo "  cargo run"
  else
    echo "Rust Hello World project already exists, skipping creation."
  fi
fi

# Start code-server
echo "Starting code-server..."
exec code-server \
  --bind-addr 0.0.0.0:8080 \
  --user-data-dir /home/rustuser/.vscode-settings \
  --extensions-dir /home/rustuser/.vscode-extensions \
  --disable-telemetry \
  --auth none \
  /home/rustuser/workspace
