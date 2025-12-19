FROM python:3.11-slim

# 1. Install git, curl, build-essential, libgomp1 (needed for some python packages)
RUN apt-get update && apt-get install -y \
    git \
    curl \
    build-essential \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# 2. Install code-server (Official Script)
RUN curl -fsSL https://code-server.dev/install.sh | sh \
    && mv /usr/bin/code-server /usr/local/bin/code-server || true

# 3. Create 'coder' user
RUN useradd -m -s /bin/bash coder

# 4. Create workspace directory
RUN mkdir -p /home/coder/app && chown -R coder:coder /home/coder/app

# 5. Switch to 'coder' user
USER coder

# 6. Configure pip to install packages in user directory
ENV PATH="/home/coder/.local/bin:$PATH"

# 7. Initialize Python Project
COPY --chown=coder:coder requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# 8. Install VS Code Extensions
RUN mkdir -p /home/coder/.vscode-extensions \
    && code-server \
    --extensions-dir /home/coder/.vscode-extensions \
    --install-extension esbenp.prettier-vscode \
    && code-server \
    --extensions-dir /home/coder/.vscode-extensions \
    --install-extension PKief.material-icon-theme \
    && code-server \
    --extensions-dir /home/coder/.vscode-extensions \
    --install-extension daniel-duc.daniel-material-palenight-theme \
    && code-server \
    --extensions-dir /home/coder/.vscode-extensions \
    --install-extension formulahendry.auto-rename-tag \
    && code-server \
    --extensions-dir /home/coder/.vscode-extensions \
    --install-extension ms-python.python \
    && code-server \
    --extensions-dir /home/coder/.vscode-extensions \
    --install-extension ms-toolsai.jupyter

# Set VS Code Settings
RUN mkdir -p /home/coder/.vscode-settings/User
COPY --chown=coder:coder settings.json /home/coder/.vscode-settings/User/settings.json

# 9. Set Working Directory
WORKDIR /home/coder/app

# 10. Set Aliases
RUN echo 'alias install="pip install"' >> /home/coder/.bashrc

# 11. Copy the entrypoint script
COPY --chown=coder:coder entrypoint.sh /home/coder/entrypoint.sh

# 12 Make it executable
RUN chmod +x /home/coder/entrypoint.sh

# 13. Expose Ports (Jupyter=8888, Code-Server=8080)
EXPOSE 8888 8080

# 14. Start the script
CMD ["/home/coder/entrypoint.sh"]