// app/api/docker-events/route.js
import { Agent, fetch as undiciFetch } from "undici";

export const dynamic = "force-dynamic"; // Prevent caching

export async function GET(req) {
  const encoder = new TextEncoder();

  // Create a TransformStream to pass data from Docker to the Client
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // 1. Setup Docker Connection (Unix Socket)
  const dockerAgent = new Agent({
    connect: { socketPath: "/var/run/docker.sock" }, // Adjust for OrbStack/Colima if needed
  });

  // 2. Start the connection to Docker's event stream
  // We filter for 'container' type events only
  const dockerRes = await undiciFetch(
    'http://localhost/events?filters={"type":["container"]}',
    {
      headers: { Accept: "application/json" },
      dispatcher: dockerAgent,
      bodoyTimeout: 0,
    }
  );

  if (!dockerRes.ok) {
    return new Response("Failed to connect to Docker events", { status: 500 });
  }

  // 3. Process the stream
  // We don't await this immediately, we let it run in the background
  (async () => {
    const reader = dockerRes.body.getReader();
    const decoder = new TextDecoder();

    // This keeps the browser connection alive even if Docker is silent
    const heartbeatInterval = setInterval(async () => {
      try {
        await writer.write(encoder.encode(": ping\n\n"));
      } catch (e) {
        clearInterval(heartbeatInterval);
      }
    }, 15000);

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Docker might send multiple JSON objects in one chunk
        // We just forward the raw chunk or parse/re-format it.
        // For SSE, we must prefix with "data: " and end with "\n\n"

        // Simple "ping" to tell client to refresh
        // We are sending a generic "update" message whenever ANY container event happens
        const sseMessage = `data: ${JSON.stringify({ refresh: true })}\n\n`;
        await writer.write(encoder.encode(sseMessage));
      }
    } catch (err) {
      console.error("Stream error:", err);
    } finally {
      try {
        await writer.close();
      } catch (e) {
        // We intentionally ignore this.
        // If the stream is already closed, our job is done.
      }
    }
  })();

  // 4. Return the Response with SSE headers
  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
