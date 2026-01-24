"use server";

import dbConnect from "@/lib/mongodb";
import Template from "@/models/Template";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const BASE_IMAGE_MAP = {
  "ubuntu-22.04": "ubuntu:22.04",
  "ubuntu-24.04": "ubuntu:24.04",
  "alpine-3.19": "alpine:3.19",
  "alpine-3.20": "alpine:3.20",
  "debian-12": "debian:12-slim",
  "node-20": "node:20-slim",
  "node-22": "node:22-slim",
  "node-24": "node:24.12.0-slim",
  "python-3.11": "python:3.11-slim",
  "python-3.12": "python:3.12-slim",
  "python-3.13": "python:3.13-slim",
};

function generateDockerfile(baseImage) {
  const dockerImage = BASE_IMAGE_MAP[baseImage] || "ubuntu:22.04";

  // Determine package manager and user based on base image
  const isNode = baseImage.startsWith("node-");
  const isPython = baseImage.startsWith("python-");
  const isAlpine = baseImage.startsWith("alpine-");

  const pkgManager = isAlpine ? "apk" : "apt-get";
  const pkgUpdate = isAlpine
    ? "apk update && apk add --no-cache"
    : "apt-get update && apt-get install -y";
  const pkgCleanup = isAlpine ? "" : "&& rm -rf /var/lib/apt/lists/*";

  const user = isNode ? "node" : isPython ? "coder" : "devuser";
  const userHome = isNode
    ? "/home/node"
    : isPython
      ? "/home/coder"
      : "/home/devuser";

  let dockerfile = `FROM ${dockerImage}

# 1. Install System Dependencies
RUN ${pkgUpdate} \\
    git \\
    curl \\
    bash \\
`;

  if (!isAlpine && !isNode && !isPython) {
    dockerfile += `    build-essential \\
`;
  }

  dockerfile += `    ${pkgCleanup}

# 2. Install code-server
RUN curl -fsSL https://code-server.dev/install.sh | sh \\
    && mv /usr/bin/code-server /usr/local/bin/code-server || true

`;

  // Create user if not a pre-existing user image
  if (!isNode && !isPython) {
    dockerfile += `# 3. Create non-root user
RUN useradd -m -s /bin/bash ${user} 2>/dev/null || adduser -D ${user}

`;
  } else {
    dockerfile += `# 3. Use existing user from base image

`;
  }

  // Add environment configuration
  if (isNode) {
    dockerfile += `# 4. Configure NPM Environment
ENV NPM_CONFIG_PREFIX=${userHome}/.npm-global
ENV PATH="${userHome}/.npm-global/bin:$PATH"

`;
  } else if (isPython) {
    dockerfile += `# 4. Configure Python Environment
ENV PATH="${userHome}/.local/bin:$PATH"
ENV PIP_BREAK_SYSTEM_PACKAGES=1

`;
  } else {
    dockerfile += `# 4. Set up environment
ENV PATH="${userHome}/.local/bin:$PATH"

`;
  }

  dockerfile += `# 5. Switch to user
USER ${user}
WORKDIR ${userHome}

# 6. Create workspace directory
RUN mkdir -p ${userHome}/workspace

# 7. Install VS Code Extensions
RUN mkdir -p ${userHome}/.vscode-extensions \\
    && code-server --extensions-dir ${userHome}/.vscode-extensions --install-extension esbenp.prettier-vscode \\
    && code-server --extensions-dir ${userHome}/.vscode-extensions --install-extension PKief.material-icon-theme \\
    && code-server --extensions-dir ${userHome}/.vscode-extensions --install-extension daniel-duc.daniel-material-palenight-theme \\
    && code-server --extensions-dir ${userHome}/.vscode-extensions --install-extension formulahendry.auto-rename-tag

# 8. Copy VS Code Settings
RUN mkdir -p ${userHome}/.vscode-settings/User
COPY --chown=${user}:${user} settings.json ${userHome}/.vscode-settings/User/settings.json

# 9. Copy entrypoint script
COPY --chown=${user}:${user} entrypoint.sh ${userHome}/entrypoint.sh
RUN chmod +x ${userHome}/entrypoint.sh

# 10. Set working directory
WORKDIR ${userHome}/workspace

# Expose code-server port
EXPOSE 8080

# Run entrypoint script
ENTRYPOINT ["/bin/bash", "${userHome}/entrypoint.sh"]
`;

  return dockerfile;
}

function generateEntrypoint(baseImage) {
  const isNode = baseImage.startsWith("node-");
  const isPython = baseImage.startsWith("python-");
  const user = isNode ? "node" : isPython ? "coder" : "devuser";
  const userHome = isNode
    ? "/home/node"
    : isPython
      ? "/home/coder"
      : "/home/devuser";

  return `#!/bin/bash
set -e

# Clone GitHub repository if GIT_REPO_URL is provided
if [ -n "$GIT_REPO_URL" ]; then
  echo "Cloning repository: $GIT_REPO_URL"
  if git clone "$GIT_REPO_URL" ${userHome}/workspace/github-repo; then
    echo "Repository cloned successfully"
  else
    echo "Failed to clone repository, continuing with empty workspace"
  fi
fi

# Start code-server
exec code-server \\
  --bind-addr 0.0.0.0:8080 \\
  --user-data-dir ${userHome}/.vscode-settings \\
  --extensions-dir ${userHome}/.vscode-extensions \\
  --disable-telemetry \\
  --auth none \\
  ${userHome}/workspace
`;
}

function generateSettingsJson() {
  return JSON.stringify(
    {
      "workbench.iconTheme": "material-icon-theme",
      "workbench.colorCustomizations": {
        "activityBarBadge.background": "#FFA000",
        "activityBar.activeBorder": "#FFA000",
        "list.activeSelectionForeground": "#FFA000",
        "list.inactiveSelectionForeground": "#FFA000",
        "list.highlightForeground": "#FFA000",
        "scrollbarSlider.activeBackground": "#FFA000",
        "editorSuggestWidget.highlightForeground": "#FFA000",
        "textLink.foreground": "#FFA000",
        "progressBar.background": "#FFA000",
        "pickerGroup.foreground": "#FFA000",
        "tab.activeBorder": "#FFA000",
        "notificationLink.foreground": "#FFA000",
        "editorWidget.resizeBorder": "#FFA000",
        "editorWidget.border": "#FFA000",
        "settings.modifiedItemIndicator": "#FFA000",
        "settings.headerForeground": "#FFA000",
        "panelTitle.activeBorder": "#FFA000",
        "breadcrumb.activeSelectionForeground": "#FFA000",
        "menu.selectionForeground": "#FFA000",
        "menubar.selectionForeground": "#FFA000",
        "editor.findMatchBorder": "#FFA000",
        "selection.background": "#FFA00040",
        "statusBarItem.remoteBackground": "#FFA000",
      },
      "workbench.startupEditor": "None",
      "editor.fontSize": 15,
      "editor.fontFamily": "Fira Code",
      "editor.lineHeight": 0,
      "editor.fontLigatures": true,
      "editor.linkedEditing": true,
      "editor.suggestSelection": "first",
      "editor.inlineSuggest.enabled": true,
      "editor.guides.bracketPairs": "active",
      "explorer.decorations.badges": false,
      "git.inputValidationSubjectLength": 72,
      "terminal.integrated.fontSize": 15,
      "terminal.integrated.fontFamily": "MesloLGS NF",
      "[html]": {
        "editor.defaultFormatter": "vscode.html-language-features",
      },
      "terminal.integrated.defaultProfile.windows": "Command Prompt",
      "update.mode": "manual",
      "explorer.confirmDelete": false,
      "tailwindCSS.includeLanguages": {
        html: "html",
        javascript: "javascript",
        css: "css",
      },
      "editor.quickSuggestions": {
        strings: true,
      },
      "editor.unicodeHighlight.ambiguousCharacters": false,
      "github.copilot.enable": {
        "*": true,
        plaintext: false,
        markdown: true,
        scminput: false,
      },
      "[javascript]": {
        "editor.defaultFormatter": "vscode.typescript-language-features",
      },
      "files.associations": {
        "*.js": "javascriptreact",
        "*.css": "css",
      },
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
      "workbench.editor.empty.hint": "hidden",
      "liveServer.settings.donotShowInfoMsg": true,
      "liveServer.settings.donotVerifyTags": true,
      "prisma.showPrismaDataPlatformNotification": false,
      "git.confirmSync": false,
      "workbench.colorTheme": "Material Palenight Theme",
    },
    null,
    2,
  );
}

export async function createTemplate({
  stackId,
  name,
  description,
  icon,
  technologies,
  baseImage,
  userId,
}) {
  try {
    // Validate required fields
    if (!stackId || !name || !baseImage || !userId) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    // Connect to database
    await dbConnect();

    // Check if stackId already exists
    const existingTemplate = await Template.findOne({ stackId });
    if (existingTemplate) {
      return {
        success: false,
        error: `Template with stackId "${stackId}" already exists`,
      };
    }

    // Create template in MongoDB
    const template = await Template.create({
      stackId,
      name,
      description,
      icon,
      technologies: Array.isArray(technologies) ? technologies : [],
      owner: userId,
      popularityScore: 0,
    });

    // Create folder structure
    const resourcesPath = path.join(
      process.cwd(),
      "public",
      "resources",
      stackId,
    );

    await fs.mkdir(resourcesPath, { recursive: true });

    // Generate and write Dockerfile
    const dockerfileContent = generateDockerfile(baseImage);
    await fs.writeFile(
      path.join(resourcesPath, "Dockerfile"),
      dockerfileContent,
      "utf-8",
    );

    // Generate and write entrypoint.sh
    const entrypointContent = generateEntrypoint(baseImage);
    await fs.writeFile(
      path.join(resourcesPath, "entrypoint.sh"),
      entrypointContent,
      "utf-8",
    );

    // Generate and write settings.json
    const settingsContent = generateSettingsJson();
    await fs.writeFile(
      path.join(resourcesPath, "settings.json"),
      settingsContent,
      "utf-8",
    );

    // Create tar file
    try {
      const tarFilePath = path.join(resourcesPath, `${stackId}.tar`);
      // Use tar command to create archive of all files in the directory
      await execAsync(
        `cd "${resourcesPath}" && tar -cf "${stackId}.tar" Dockerfile entrypoint.sh settings.json`,
      );
      console.log(`[CREATE-TEMPLATE] Tar file created: ${tarFilePath}`);
    } catch (tarError) {
      console.error("Error creating tar file:", tarError);
      // Clean up created files if tar creation fails
      await fs.rm(resourcesPath, { recursive: true, force: true });
      return {
        success: false,
        error: "Failed to create tar file for template",
      };
    }

    return {
      success: true,
      template: JSON.parse(JSON.stringify(template)),
    };
  } catch (error) {
    console.error("Error creating template:", error);
    return {
      success: false,
      error: error.message || "Failed to create template",
    };
  }
}
