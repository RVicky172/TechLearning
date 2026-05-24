import type { TopicNode } from "@/data/types";

export const wsFundamentals: TopicNode = {
  id: "websockets-fundamentals",
  title: "WebSocket Protocol",
  iconName: "Wifi",
  link: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
  theory:
    "WebSockets provide a persistent, full-duplex communication channel over a single TCP connection. Unlike HTTP where the client always initiates, a WebSocket connection allows either side — client or server — to send data at any time. This makes them ideal for real-time features like live chat, notifications, collaborative editing, and live dashboards.",
  theoryDetail: {
    keyConcepts: [
      "HTTP Upgrade: a WebSocket connection starts as an HTTP/1.1 request with Upgrade: websocket — the server acknowledges with 101 Switching Protocols",
      "Full-duplex: both client and server can send messages simultaneously — no request/response cycle required",
      "Frames: WebSocket messages are sent as frames (text or binary); large messages are split into multiple frames automatically",
      "Events (browser API): onopen, onmessage, onerror, onclose — the four lifecycle events of a WebSocket connection",
      "Heartbeat / ping-pong: servers send periodic ping frames; clients respond with pong to confirm the connection is alive",
      "Close codes: 1000 (normal), 1001 (going away), 1006 (abnormal), 1011 (server error) — useful for debugging disconnects",
      "Compared to SSE: Server-Sent Events (EventSource) are one-directional (server → client) and simpler; use SSE for notifications, WebSockets for bidirectional communication",
    ],
    whyItMatters:
      "Any feature that requires pushing data from server to client — live chat, real-time collaboration, live feeds, multiplayer games, financial tickers — requires WebSockets or SSE. This is a standard interview topic and a practical skill for any fullstack developer.",
    commonPitfalls: [
      "Not handling reconnection — network drops close the socket; implement exponential backoff reconnection logic",
      "Sending large payloads — WebSockets are not designed for large file transfers; use HTTP for those and WebSockets for small, frequent messages",
      "No authentication on the WebSocket endpoint — the HTTP handshake is the only place to authenticate; validate a token in the upgrade handler before accepting the connection",
      "Not handling the connection at scale — a single Node.js server can handle thousands of WebSocket connections; for millions, use Redis pub/sub to fan out messages across multiple server instances",
    ],
    examples: [
      {
        title: "Browser WebSocket API with reconnection logic",
        description:
          "A production-ready WebSocket client that auto-reconnects with exponential backoff.",
        code: `class ReconnectingWebSocket {
  private ws: WebSocket | null = null;
  private attempt  = 0;
  private maxDelay = 30_000;

  constructor(
    private readonly url: string,
    private readonly onMessage: (data: unknown) => void,
  ) {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.attempt = 0;                 // reset backoff on successful connect
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string);
        this.onMessage(data);
      } catch {
        console.warn("Received non-JSON message:", event.data);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = (event) => {
      if (event.code === 1000) return;   // intentional close — do not reconnect
      const delay = Math.min(1000 * 2 ** this.attempt++, this.maxDelay);
      console.log(\`Reconnecting in \${delay}ms (attempt \${this.attempt})\`);
      setTimeout(() => this.connect(), delay);
    };
  }

  send(data: object) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  close() {
    this.ws?.close(1000);
  }
}

// Usage in a React hook
function useWebSocket(url: string) {
  const [messages, setMessages] = useState<unknown[]>([]);
  const wsRef = useRef<ReconnectingWebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new ReconnectingWebSocket(url, (data) =>
      setMessages((prev) => [...prev, data]),
    );
    return () => wsRef.current?.close();
  }, [url]);

  const send = useCallback((data: object) => wsRef.current?.send(data), []);

  return { messages, send };
}`,
        language: "typescript",
      },
    ],
  },
};
