import type { Technology } from "@/data/types";
import { wsFundamentals } from "@/data/technologies/websockets/fundamentals";
import { wsSocketIO } from "@/data/technologies/websockets/socketio";

const websockets: Technology = {
  id: "websockets",
  name: "WebSockets",
  description:
    "Full-duplex real-time communication — build live chat, notifications, dashboards, and collaborative features.",
  color: "bg-green-600",
  iconName: "Wifi",
  deviconClass: "devicon-socketio-original",
  tree: [wsFundamentals, wsSocketIO],
};

export default websockets;
