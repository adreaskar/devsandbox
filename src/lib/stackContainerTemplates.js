function getContainerTemplate(stack, hostPort, idePort, userId) {
  switch (stack) {
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

    // Add more stack templates as needed
    default:
      throw new Error(`Unsupported stack: ${stack}`);
  }
}

export default getContainerTemplate;
