FROM mcr.microsoft.com/dotnet/sdk:10.0

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

# 3. Create 'dotnet' user
RUN useradd -m -s /bin/bash dotnet

# 4. Configure .NET environment for user
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1
ENV DOTNET_ROOT=/usr/share/dotnet
ENV PATH="/home/dotnet/.dotnet/tools:$PATH"

# 5. Switch to 'dotnet' user
USER dotnet
WORKDIR /home/dotnet

# 6. Install .NET global tools
RUN dotnet tool install --global dotnet-ef

# 7. Create initial project structure
RUN mkdir -p /home/dotnet/workspace

# 8. Install VS Code Extensions
RUN mkdir -p /home/dotnet/.vscode-extensions \
    && code-server \
    --extensions-dir /home/dotnet/.vscode-extensions \
    --install-extension esbenp.prettier-vscode \
    && code-server \
    --extensions-dir /home/dotnet/.vscode-extensions \
    --install-extension PKief.material-icon-theme \
    && code-server \
    --extensions-dir /home/dotnet/.vscode-extensions \
    --install-extension daniel-duc.daniel-material-palenight-theme \
    && code-server \
    --extensions-dir /home/dotnet/.vscode-extensions \
    --install-extension formulahendry.auto-rename-tag

# 9. Copy VS Code Settings
RUN mkdir -p /home/dotnet/.vscode-settings/User
COPY --chown=dotnet:dotnet settings.json /home/dotnet/.vscode-settings/User/settings.json

# 10. Copy entrypoint script
COPY --chown=dotnet:dotnet entrypoint.sh /home/dotnet/entrypoint.sh
RUN chmod +x /home/dotnet/entrypoint.sh

# 11. Set working directory
WORKDIR /home/dotnet/workspace

# 12. Expose code-server port
EXPOSE 8080

# 13. Run entrypoint script
ENTRYPOINT ["/home/dotnet/entrypoint.sh"]
