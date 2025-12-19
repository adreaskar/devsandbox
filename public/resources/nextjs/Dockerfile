FROM node:20-slim

# 1. Install git AND curl (curl is needed for code-server install)
# We do this as root before switching users
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 2. Install code-server 
RUN curl -fsSL https://code-server.dev/install.sh | sh \
    && mv /usr/bin/code-server /usr/local/bin/code-server || true

# 3. Configure NPM environment
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH="/home/node/.npm-global/bin:$PATH"
ENV NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000
ENV NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000

# 4. Switch to 'node' user
USER node
WORKDIR /home/node

# 5. Initialize Next.js Project
RUN npm install -g create-next-app
RUN create-next-app app \
    --js \
    --tailwind \
    --eslint \
    --app \
    --no-src-dir \
    --import-alias "@/*" \
    --use-npm \
    --yes

# 6. Install VS Code Extensions
# We run this BEFORE setting the final WORKDIR so it installs globally for the user
RUN mkdir -p /home/node/.vscode-extensions \
    && code-server \
    --extensions-dir /home/node/.vscode-extensions \
    --install-extension daniel-duc.daniel-material-palenight-theme \
    && code-server \
    --extensions-dir /home/node/.vscode-extensions \
    --install-extension PKief.material-icon-theme \
    && code-server \
    --extensions-dir /home/node/.vscode-extensions \
    --install-extension formulahendry.auto-rename-tag \
    && code-server \
    --extensions-dir /home/node/.vscode-extensions \
    --install-extension dsznajder.es7-react-js-snippets \
    && code-server \
    --extensions-dir /home/node/.vscode-extensions \
    --install-extension esbenp.prettier-vscode \
    && code-server \
    --extensions-dir /home/node/.vscode-extensions \
    --install-extension Prisma.prisma \
    && code-server \
    --extensions-dir /home/node/.vscode-extensions \
    --install-extension YoavBls.pretty-ts-errors \
    && code-server \
    --extensions-dir /home/node/.vscode-extensions \
    --install-extension bradlc.vscode-tailwindcss \
    && code-server \
    --extensions-dir /home/node/.vscode-extensions \
    --install-extension alfredbirk.tailwind-documentation 

# 7. Copy VS Code Settings
RUN mkdir -p /home/node/.vscode-settings/User
COPY --chown=node:node settings.json /home/node/.vscode-settings/User/settings.json

# 8. Set Workdir
WORKDIR /home/node/app

# 9. Expose Ports
EXPOSE 3000 8080

# 10. Start code-server with Next.js app folder
CMD ["code-server", \
    "--bind-addr", "0.0.0.0:8080", \
    "--auth", "password", \
    "--user-data-dir", "/home/node/.vscode-settings", \
    "--extensions-dir", "/home/node/.vscode-extensions", \
    "/home/node/app"]