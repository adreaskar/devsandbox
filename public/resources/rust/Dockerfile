FROM rust:1.75

# 1. Install System Dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    bash \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 2. Install code-server
RUN curl -fsSL https://code-server.dev/install.sh | sh \
    && mv /usr/bin/code-server /usr/local/bin/code-server || true

# 3. Create 'rustuser' user
RUN useradd -m -s /bin/bash rustuser

# 4. Copy Rust installation to user directory
RUN cp -r /usr/local/cargo /home/rustuser/.cargo && \
    cp -r /usr/local/rustup /home/rustuser/.rustup && \
    chown -R rustuser:rustuser /home/rustuser/.cargo /home/rustuser/.rustup

# 5. Set up Rust environment
ENV CARGO_HOME=/home/rustuser/.cargo
ENV RUSTUP_HOME=/home/rustuser/.rustup
ENV PATH=$CARGO_HOME/bin:$PATH

# 6. Add Rust to user's bash profile
RUN echo 'export CARGO_HOME=/home/rustuser/.cargo' >> /home/rustuser/.bashrc && \
    echo 'export RUSTUP_HOME=/home/rustuser/.rustup' >> /home/rustuser/.bashrc && \
    echo 'export PATH=$CARGO_HOME/bin:$PATH' >> /home/rustuser/.bashrc && \
    chown rustuser:rustuser /home/rustuser/.bashrc

# 7. Create workspace directory and set permissions
RUN mkdir -p /home/rustuser/workspace && \
    chown -R rustuser:rustuser /home/rustuser && \
    chmod -R 755 /home/rustuser/workspace

# 8. Switch to rustuser
USER rustuser

# 9. Verify Rust is accessible
RUN rustc --version && cargo --version

# 10. Install VS Code Extensions
RUN mkdir -p /home/rustuser/.vscode-extensions \
    && code-server \
    --extensions-dir /home/rustuser/.vscode-extensions \
    --install-extension esbenp.prettier-vscode \
    && code-server \
    --extensions-dir /home/rustuser/.vscode-extensions \
    --install-extension PKief.material-icon-theme \
    && code-server \
    --extensions-dir /home/rustuser/.vscode-extensions \
    --install-extension daniel-duc.daniel-material-palenight-theme \
    && code-server \
    --extensions-dir /home/rustuser/.vscode-extensions \
    --install-extension formulahendry.auto-rename-tag \
    && code-server \
   1--extensions-dir /home/rustuser/.vscode-extensions \
    --install-extension rust-lang.rust-analyzer

# 10. Copy VS Code Settings
RUN mkdir -p /home/rustuser/.vscode-settings/User
COPY --chown=rustuser:rustuser settings.json /home/rustuser/.vscode-settings/User/settings.json

# 12. Copy entrypoint script
COPY --chown=rustuser:rustuser entrypoint.sh /home/rustuser/entrypoint.sh
RUN chmod +x /home/rustuser/entrypoint.sh

# 13. Set working directory
WORKDIR /home/rustuser/workspace

# 14. Ensure workspace has correct permissions
USER root
RUN chown -R rustuser:rustuser /home/rustuser/workspace && chmod -R 755 /home/rustuser/workspace
USER rustuser

# 15. Expose code-server port and Rust app port
EXPOSE 8080 8000

# 16. Set entrypoint
ENTRYPOINT ["/home/rustuser/entrypoint.sh"]
