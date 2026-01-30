#!/bin/bash
set -e

# Clone GitHub repository if GIT_REPO_URL is provided
if [ -n "$GIT_REPO_URL" ]; then
  echo "Cloning repository: $GIT_REPO_URL"
  cd /home/dotnet/workspace
  if git clone "$GIT_REPO_URL" github-repo; then
    echo "Repository cloned successfully"
    cd github-repo
  else
    echo "Failed to clone repository, continuing with empty workspace"
  fi
else
  cd /home/dotnet/workspace
  
  if [ ! -d "HelloWorld" ]; then
    echo "No repository provided. Creating .NET Hello World boilerplate..."
    
    # Create a new console application
    dotnet new console -n HelloWorld -o HelloWorld
    
    echo ".NET Hello World project created successfully!"
    echo "To run the application:"
    echo "  cd HelloWorld"
    echo "  dotnet run"
  else
    echo ".NET Hello World project already exists, skipping creation."
  fi
fi

# Start code-server
echo "Starting code-server..."
exec code-server \
  --bind-addr 0.0.0.0:8080 \
  --user-data-dir /home/dotnet/.vscode-settings \
  --extensions-dir /home/dotnet/.vscode-extensions \
  --disable-telemetry \
  --auth none \
  /home/dotnet/workspace
