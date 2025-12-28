FROM node:24.12.0-slim

# 1. Install System Dependencies
# python3 and build-essential are often needed for node-gyp (compiling native modules)
RUN apt-get update && apt-get install -y \
    git \
    curl \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 2. Install code-server
RUN curl -fsSL https://code-server.dev/install.sh | sh \
    && mv /usr/bin/code-server /usr/local/bin/code-server || true

# 3. Configure NPM Environment
# We prepend to PATH so global installs works for the non-root user
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH="/home/node/.npm-global/bin:$PATH"

# 4. Switch to 'node' user
USER node
WORKDIR /home/node

# 5. Initialize Project (Vite + React 19 + Express)
RUN npm install -g create-vite \
    && mkdir -p nodereactapp/backend nodereactapp/frontend \
    # --- BACKEND SETUP ---
    && cd nodereactapp/backend \
    && npm init -y \
    # Enable ES Modules (import/export)
    && npm pkg set type="module" \
    && npm install express cors \
    # Create a simple Express server.js file
    # We use concatenation in console.log to avoid complex escaping of backticks/variables in Docker
    && echo "import express from 'express';\nimport cors from 'cors';\n\nconst app = express();\nconst port = 3000;\n\napp.use(cors());\napp.use(express.json());\n\napp.get('/', (req, res) => {\n  res.json({ message: 'Hello from Express Backend!' });\n});\n\napp.listen(port, () => {\n  console.log('Backend listening on port ' + port);\n});" > server.js \
    # --- FRONTEND SETUP ---
    && cd ../frontend \
    # Create Vite app in current directory (.)
    && create-vite . --template react \
    && npm install \
    && npm install react@19 react-dom@19 \
    # Fix Vite Config to bind to 0.0.0.0
    && echo "import { defineConfig } from \"vite\";\nimport react from \"@vitejs/plugin-react\";\n\nexport default defineConfig({\n  plugins: [react()],\n  server: { host: \"0.0.0.0\", port: 5173 }\n});" > vite.config.js

# 6. Install VS Code Extensions
# Installed into the user's home directory to persist across volume mounts
RUN mkdir -p /home/node/.vscode-extensions \
    && code-server --extensions-dir /home/node/.vscode-extensions --install-extension dsznajder.es7-react-js-snippets \
    && code-server --extensions-dir /home/node/.vscode-extensions --install-extension esbenp.prettier-vscode \
    && code-server --extensions-dir /home/node/.vscode-extensions --install-extension dbaeumer.vscode-eslint \
    && code-server --extensions-dir /home/node/.vscode-extensions --install-extension bradlc.vscode-tailwindcss \
    && code-server --extensions-dir /home/node/.vscode-extensions --install-extension PKief.material-icon-theme \
    && code-server --extensions-dir /home/node/.vscode-extensions --install-extension daniel-duc.daniel-material-palenight-theme \
    && code-server --extensions-dir /home/node/.vscode-extensions --install-extension formulahendry.auto-rename-tag

# 7. Copy VS Code Settings
RUN mkdir -p /home/node/.vscode-settings/User
COPY --chown=node:node settings.json /home/node/.vscode-settings/User/settings.json

# 8. Set Final Workdir
WORKDIR /home/node/app

# 9. Expose Ports
# 8080: Code Server
# 5173: Vite (Default React Port)
# 3000: Express (Standard Backend Port)
EXPOSE 8080 5173 3000

# 10. Start code-server
CMD ["code-server", \
    "--bind-addr", "0.0.0.0:8080", \
    "--auth", "none", \
    "--user-data-dir", "/home/node/.vscode-settings", \
    "--extensions-dir", "/home/node/.vscode-extensions", \
    "/home/node/nodereactapp"]