import type { TopicNode } from "@/data/types";

export const nodeStreams: TopicNode = {
  id: "node-streams",
  title: "Streams & Buffers",
  iconName: "Waves",
  theory: "Streams are collections of data—just like arrays or strings. The difference is that streams might not be available all at once, and they don't have to fit in memory. This makes streams extremely powerful for handling massive files or network payloads.",
  theoryDetail: {
    keyConcepts: [
      "Buffer: A fixed-length chunk of memory allocated outside the V8 JavaScript engine. Node uses it to store raw binary data.",
      "Readable Stream: Data can be read from it (e.g., fs.createReadStream, req in Express).",
      "Writable Stream: Data can be written to it (e.g., fs.createWriteStream, res in Express).",
      "Duplex/Transform Stream: Can both read and write (e.g., TCP sockets, Zlib compression)."
    ],
    whyItMatters: "If a user uploads a 5GB video and you try to read it into a variable with fs.readFile(), your server will crash with an 'Out of Memory' error. Streams allow you to process the file in small 64kb chunks, using almost zero RAM.",
    commonPitfalls: [
      "Using readFile instead of createReadStream for large files.",
      "Not handling 'error' events on streams, which causes the Node process to crash.",
      "Memory leaks from not properly destroying streams."
    ],
    examples: [
      {
        title: "Piping Streams (The Memory-Safe Way)",
        description: "How to copy a massive file or send it to the client without eating up RAM.",
        code: `import fs from 'fs';
import http from 'http';

const server = http.createServer((req, res) => {
  // ❌ BAD: Loads the entire 2GB file into memory before sending
  // fs.readFile('huge-video.mp4', (err, data) => res.send(data));

  // ✅ GOOD: Pipes the file to the response chunk by chunk
  const readStream = fs.createReadStream('huge-video.mp4');
  
  // The 'pipe' method automatically handles backpressure 
  // (pausing the read if the network response is too slow)
  readStream.pipe(res);
  
  // Always handle errors to prevent crashes!
  readStream.on('error', (err) => {
    res.statusCode = 500;
    res.end('File not found');
  });
});

server.listen(3000);`,
        language: "javascript"
      }
    ]
  },
  children: []
};
