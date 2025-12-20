#!/bin/bash

# 1. Start Jupyter Lab in the background (&)
# We use --NotebookApp.token='' to disable the token login for easier access
# (Since code-server already protects the container with a password)
echo "Starting Jupyter Lab..."
jupyter lab --ip=0.0.0.0 --port=8888 --no-browser --NotebookApp.token='' --allow-root &

# 2. Start code-server in the foreground
# We use 'exec' so code-server becomes the main process
echo "Starting code-server..."
exec code-server --bind-addr 0.0.0.0:8080 --user-data-dir /home/coder/.vscode-settings --auth none --extensions-dir /home/coder/.vscode-extensions /home/coder/app