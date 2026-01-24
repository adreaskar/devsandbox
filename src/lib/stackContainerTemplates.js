function getContainerTemplate(
  stack,
  hostPort,
  idePort,
  userId,
  gitRepoUrl = "",
) {
  switch (stack) {
    // Node.js + React template
    case "nodereact":
      return {
        User: "node",
        Env: gitRepoUrl ? [`GIT_REPO_URL=${gitRepoUrl}`] : [],
        ExposedPorts: {
          "5173/tcp": {},
          "3000/tcp": {},
        },
        Labels: {
          created_by: "devsandbox",
          owner: userId,
        },
        HostConfig: {
          PortBindings: {
            "5173/tcp": [
              {
                HostIp: "0.0.0.0",
                HostPort: hostPort,
              },
            ],
            "8080/tcp": [
              {
                HostIp: "0.0.0.0",
                HostPort: idePort,
              },
            ],
            // Note: Port 3000 (Express) is exposed internally but not bound to the host
            // because we only have one 'hostPort' variable available in this context.
            // Ideally, the Frontend talks to the Backend via internal localhost:3000.
          },
          AutoRemove: false,
        },
      };
    // Next.js template
    case "nextjs":
      return {
        User: "node",
        Env: gitRepoUrl ? [`GIT_REPO_URL=${gitRepoUrl}`] : [],
        ExposedPorts: {
          "3000/tcp": {},
        },
        Labels: {
          created_by: "devsandbox",
          owner: userId,
        },
        HostConfig: {
          PortBindings: {
            "3000/tcp": [
              {
                HostIp: "0.0.0.0",
                HostPort: hostPort,
              },
            ],
            "8080/tcp": [
              {
                HostIp: "0.0.0.0",
                HostPort: idePort,
              },
            ],
          },
          AutoRemove: false,
        },
      };
    // Django template
    case "django":
      return {
        User: "python_user",
        Env: gitRepoUrl ? [`GIT_REPO_URL=${gitRepoUrl}`] : [],
        ExposedPorts: {
          "8000/tcp": {},
        },
        Labels: {
          created_by: "devsandbox",
          owner: userId,
        },
        HostConfig: {
          PortBindings: {
            "8000/tcp": [
              {
                HostIp: "0.0.0.0",
                HostPort: hostPort,
              },
            ],
            "8080/tcp": [
              {
                HostIp: "0.0.0.0",
                HostPort: idePort,
              },
            ],
          },
          AutoRemove: false,
        },
      };
    // Python Jupyter Lab template
    case "python":
      return {
        User: "coder",
        Env: gitRepoUrl ? [`GIT_REPO_URL=${gitRepoUrl}`] : [],
        ExposedPorts: { "8888/tcp": {} },
        Labels: {
          created_by: "devsandbox",
          owner: userId,
        },
        HostConfig: {
          PortBindings: {
            "8888/tcp": [
              {
                HostIp: "0.0.0.0",
                HostPort: hostPort,
              },
            ],
            "8080/tcp": [
              {
                HostIp: "0.0.0.0",
                HostPort: idePort,
              },
            ],
          },
          AutoRemove: false,
        },
      };

    // Generic template for custom stacks
    default:
      // For any custom template, use a generic configuration
      // The user will be determined by the base image used
      return {
        Env: gitRepoUrl ? [`GIT_REPO_URL=${gitRepoUrl}`] : [],
        ExposedPorts: {
          "8080/tcp": {}, // code-server port
        },
        Labels: {
          created_by: "devsandbox",
          owner: userId,
        },
        HostConfig: {
          PortBindings: {
            "8080/tcp": [
              {
                HostIp: "0.0.0.0",
                HostPort: idePort,
              },
            ],
          },
          AutoRemove: false,
        },
      };
  }
}

export default getContainerTemplate;
