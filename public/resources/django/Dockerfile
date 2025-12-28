FROM python:3.12-slim

# 1. Install System Dependencies
# git, curl: Standard tools
# build-essential: Needed for compiling some python packages
RUN apt-get update && apt-get install -y \
    git \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 2. Install code-server
RUN curl -fsSL https://code-server.dev/install.sh | sh \
    && mv /usr/bin/code-server /usr/local/bin/code-server || true

# 3. Create a non-root user
# We call it 'python_user' to align with the 'node' pattern
RUN useradd -m -s /bin/bash python_user
ENV PATH="/home/python_user/.local/bin:$PATH"
# Allow global pip installs without warnings in this container
ENV PIP_BREAK_SYSTEM_PACKAGES=1 

# 4. Switch to user
USER python_user
WORKDIR /home/python_user

# 5. Initialize Project in a TEMPLATE directory
# We install Django, DRF, and CORS headers
RUN pip install --no-cache-dir django djangorestframework django-cors-headers \
    && mkdir -p project_template \
    && cd project_template \
    # Create standard Django project named 'backend'
    && django-admin startproject backend . \
    # AUTOMATICALLY CONFIGURE SETTINGS
    # 1. Allow all hosts (so we can access via host IP)
    # 2. Add 'rest_framework' and 'corsheaders' to INSTALLED_APPS
    # 3. Add 'corsheaders.middleware.CorsMiddleware' to MIDDLEWARE
    # 4. Allow all CORS origins
    && echo "\n\
# --- DEVSANDBOX AUTO-CONFIG ---\n\
ALLOWED_HOSTS = ['*']\n\
CORS_ALLOW_ALL_ORIGINS = True\n\
\n\
INSTALLED_APPS += ['rest_framework', 'corsheaders']\n\
\n\
MIDDLEWARE.insert(0, 'corsheaders.middleware.CorsMiddleware')\n\
" >> backend/settings.py

# 6. Create the Entrypoint Script
RUN echo '#!/bin/bash\n\
# If app directory is empty, copy the template files\n\
if [ -z "$(ls -A /home/python_user/app)" ]; then\n\
    echo "Initializing Django Workspace..."\n\
    cp -a /home/python_user/project_template/. /home/python_user/app/\n\
fi\n\
# Execute the passed command (code-server)\n\
exec "$@"\n\
' > /home/python_user/entrypoint.sh \
    && chmod +x /home/python_user/entrypoint.sh

# 7. Install VS Code Extensions for Python
RUN mkdir -p /home/python_user/.vscode-extensions \
    && code-server --extensions-dir /home/python_user/.vscode-extensions --install-extension ms-python.python \
    && code-server --extensions-dir /home/python_user/.vscode-extensions --install-extension ms-python.debugpy \
    && code-server --extensions-dir /home/python_user/.vscode-extensions --install-extension batisteo.vscode-django \
    && code-server --extensions-dir /home/python_user/.vscode-extensions --install-extension PKief.material-icon-theme \
    && code-server --extensions-dir /home/python_user/.vscode-extensions --install-extension daniel-duc.daniel-material-palenight-theme

# 8. Copy VS Code Settings
RUN mkdir -p /home/python_user/.vscode-settings/User
COPY --chown=python_user:python_user settings.json /home/python_user/.vscode-settings/User/settings.json

# 9. Final Setup
RUN mkdir -p /home/python_user/app
WORKDIR /home/python_user/app

# Ports: 8080 (IDE), 8000 (Django)
EXPOSE 8080 8000

# 10. Start
ENTRYPOINT ["/home/python_user/entrypoint.sh"]

CMD ["code-server", \
    "--bind-addr", "0.0.0.0:8080", \
    "--auth", "none", \
    "--user-data-dir", "/home/python_user/.vscode-settings", \
    "--extensions-dir", "/home/python_user/.vscode-extensions", \
    "/home/python_user/app"]