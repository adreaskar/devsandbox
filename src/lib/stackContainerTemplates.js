function getContainerTemplate(stack, hostPort, idePort, userId) {
  switch (stack) {
    // Node.js + React template
    case "nodereact":
      return {
        User: "node",
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

    default:
      throw new Error(`Unsupported stack: ${stack}`);
  }
}

export default getContainerTemplate;
