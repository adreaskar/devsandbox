import fs from "fs";
import path from "path";
import { Agent, fetch as undiciFetch } from "undici";

const DOCKER_HOST = "http://localhost";
const dockerAgent = new Agent({
  connect: {
    socketPath: "/var/run/docker.sock",
  },
});

async function buildImage(stack, dockerHost, imageName) {
  const tarPath = path.join(
    process.cwd(),
    "public",
    "resources",
    stack,
    `${stack}.tar`
  );

  try {
    var tarBuffer = fs.readFileSync(tarPath);
  } catch (err) {
    throw new Error(`Unsupported stack: ${stack}`);
  }

  const buildRes = await undiciFetch(`${dockerHost}/build?t=${imageName}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-tar" },
    body: tarBuffer,
    duplex: "half",
    dispatcher: dockerAgent,
  });

  if (!buildRes.ok)
    throw new Error(`Build request failed: ${await buildRes.text()}`);

  const reader = buildRes.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // 1. Decode the binary chunk to text
    buffer += decoder.decode(value, { stream: true });

    // 2. Docker sends JSON objects separated by newlines.
    // We need to split them and parse each line.
    const lines = buffer.split("\n");

    // Save the last partial line back to the buffer to wait for the next chunk
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.trim()) continue; // Skip empty lines

      try {
        const msg = JSON.parse(line);

        // 3. CRITICAL: Check if Docker reported an error
        if (msg.error) {
          throw new Error(
            `Docker Build Error: ${msg.error} \nDetails: ${msg.errorDetail?.message}`
          );
        }

        // Optional: Print build logs to your server console so you can see progress
        if (msg.stream) {
          process.stdout.write(
            "[DOCKER-ENVIRONMENT] [CONTAINER] -- " + msg.stream
          );
        }
      } catch (e) {
        // If we manually threw an error above, re-throw it to stop the function
        if (e.message.startsWith("Docker Build Error")) throw e;
        // Otherwise ignore parsing errors (rare)
      }
    }
  }

  console.log("[DOCKER-ENVIRONMENT] -- Build complete.");
}

export default buildImage;
