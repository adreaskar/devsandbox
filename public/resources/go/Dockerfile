FROM golang:1.23

# 1. Install System Dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    bash \
    && rm -rf /var/lib/apt/lists/*

# 2. Install code-server
RUN curl -fsSL https://code-server.dev/install.sh | sh \
    && mv /usr/bin/code-server /usr/local/bin/code-server || true

# 3. Create 'gouser' user
RUN useradd -m -s /bin/bash gouser

# 4. Set up Go environment
ENV GOPATH=/home/gouser/go
ENV PATH=/usr/local/go/bin:$GOPATH/bin:$PATH

# 5. Add Go to user's bash profile
RUN echo 'export GOPATH=/home/gouser/go' >> /home/gouser/.bashrc && \
    echo 'export PATH=/usr/local/go/bin:$GOPATH/bin:$PATH' >> /home/gouser/.bashrc && \
    chown gouser:gouser /home/gouser/.bashrc

# 6. Verify Go installation
RUN go version

# 7. Create workspace directory and set permissions
RUN mkdir -p /home/gouser/workspace && \
    chown -R gouser:gouser /home/gouser && \
    chmod -R 755 /home/gouser/workspace

# 8. Switch to gouser
USER gouser

# 9. Install VS Code Extensions
RUN mkdir -p /home/gouser/.vscode-extensions \
    && code-server \
    --extensions-dir /home/gouser/.vscode-extensions \
    --install-extension esbenp.prettier-vscode \
    && code-server \
    --extensions-dir /home/gouser/.vscode-extensions \
    --install-extension PKief.material-icon-theme \
    && code-server \
    --extensions-dir /home/gouser/.vscode-extensions \
    --install-extension daniel-duc.daniel-material-palenight-theme \
    && code-server \
    --extensions-dir /home/gouser/.vscode-extensions \
    --install-extension formulahendry.auto-rename-tag \
    && code-server \
    --extensions-dir /home/gouser/.vscode-extensions \
    --install-extension golang.go

# 10. Copy VS Code Settings
RUN mkdir -p /home/gouser/.vscode-settings/User
COPY --chown=gouser:gouser settings.json /home/gouser/.vscode-settings/User/settings.json

# 11. Copy entrypoint script
COPY --chown=gouser:gouser entrypoint.sh /home/gouser/entrypoint.sh
RUN chmod +x /home/gouser/entrypoint.sh

# 12. Set working directory
WORKDIR /home/gouser/workspace

# 13. Ensure workspace has correct permissions
USER root
RUN chown -R gouser:gouser /home/gouser/workspace && chmod -R 755 /home/gouser/workspace
USER gouser

# 14. Expose code-server port and Go app port
EXPOSE 8080 3000

# 15. Set entrypoint
ENTRYPOINT ["/home/gouser/entrypoint.sh"]
