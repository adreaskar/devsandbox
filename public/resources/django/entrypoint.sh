#!/bin/bash

# Clone GitHub repo if GIT_REPO_URL is provided
if [ -n "$GIT_REPO_URL" ]; then
  echo "Cloning repository: $GIT_REPO_URL"
  cd /home/python_user/workspace
  git clone "$GIT_REPO_URL" github-repo 2>/dev/null || echo "Failed to clone repository, continuing with default setup..."
fi

# Start code-server
exec code-server \
    --bind-addr 0.0.0.0:8080 \
    --auth none \
    --user-data-dir /home/python_user/.vscode-settings \
    --extensions-dir /home/python_user/.vscode-extensions \
    /home/python_user/workspace
