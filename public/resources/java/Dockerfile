FROM eclipse-temurin:21-jdk

# 1. Install System Dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    bash \
    maven \
    && rm -rf /var/lib/apt/lists/*

# 2. Install code-server
RUN curl -fsSL https://code-server.dev/install.sh | sh \
    && mv /usr/bin/code-server /usr/local/bin/code-server || true

# 3. Create 'javauser' user
RUN useradd -m -s /bin/bash javauser

# 4. Set up Java environment
ENV JAVA_HOME=/opt/java/openjdk
ENV MAVEN_HOME=/usr/share/maven
ENV PATH=$JAVA_HOME/bin:$MAVEN_HOME/bin:$PATH

# 5. Add Java to user's bash profile
RUN echo 'export JAVA_HOME=/opt/java/openjdk' >> /home/javauser/.bashrc && \
    echo 'export MAVEN_HOME=/usr/share/maven' >> /home/javauser/.bashrc && \
    echo 'export PATH=$JAVA_HOME/bin:$MAVEN_HOME/bin:$PATH' >> /home/javauser/.bashrc && \
    chown javauser:javauser /home/javauser/.bashrc

# 6. Verify Java installation
RUN java -version && mvn -version

# 7. Create workspace directory and set permissions
RUN mkdir -p /home/javauser/workspace && \
    chown -R javauser:javauser /home/javauser && \
    chmod -R 755 /home/javauser/workspace

# 8. Switch to javauser
USER javauser

# 9. Install VS Code Extensions
RUN mkdir -p /home/javauser/.vscode-extensions \
    && code-server \
    --extensions-dir /home/javauser/.vscode-extensions \
    --install-extension esbenp.prettier-vscode \
    && code-server \
    --extensions-dir /home/javauser/.vscode-extensions \
    --install-extension PKief.material-icon-theme \
    && code-server \
    --extensions-dir /home/javauser/.vscode-extensions \
    --install-extension daniel-duc.daniel-material-palenight-theme \
    && code-server \
    --extensions-dir /home/javauser/.vscode-extensions \
    --install-extension formulahendry.auto-rename-tag \
    && code-server \
    --extensions-dir /home/javauser/.vscode-extensions \
    --install-extension redhat.java

# 10. Copy VS Code Settings
RUN mkdir -p /home/javauser/.vscode-settings/User
COPY --chown=javauser:javauser settings.json /home/javauser/.vscode-settings/User/settings.json

# 11. Copy entrypoint script
COPY --chown=javauser:javauser entrypoint.sh /home/javauser/entrypoint.sh
RUN chmod +x /home/javauser/entrypoint.sh

# 12. Set working directory
WORKDIR /home/javauser/workspace

# 13. Ensure workspace has correct permissions
USER root
RUN chown -R javauser:javauser /home/javauser/workspace && chmod -R 755 /home/javauser/workspace
USER javauser

# 14. Expose code-server port and Java app port
EXPOSE 8080 8081

# 15. Set entrypoint
ENTRYPOINT ["/home/javauser/entrypoint.sh"]
