import net from "net";

// Helper: Check if a single port is free
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", (err) => {
      // If code is EADDRINUSE, the port is taken
      if (err.code === "EADDRINUSE") {
        resolve(false);
      } else {
        // Any other error (e.g. permission), assume unsafe to use
        resolve(false);
      }
    });

    server.once("listening", () => {
      // It worked! Close the server immediately and return true.
      server.close(() => resolve(true));
    });

    // We check 0.0.0.0 because that is where Docker usually binds
    server.listen(port, "0.0.0.0");
  });
}

// Finds next port that is:
// 1. Open on the OS
// 2. NOT in the excludedPorts list (from DB)
async function findAvailablePort(startPort, endPort, excludePorts = []) {
  const reservedSet = new Set(excludePorts.map((p) => Number(p)));

  for (let port = startPort; port <= endPort; port++) {
    // 1. Fast Check: Is it in our DB blocklist?
    if (reservedSet.has(port)) {
      continue;
    }

    // 2. Real Check: Is the OS actually using it?
    const available = await isPortAvailable(port);
    if (available) {
      return port.toString();
    }
  }
  throw new Error(
    `No available ports found between ${startPort} and ${endPort}`
  );
}

export default findAvailablePort;
