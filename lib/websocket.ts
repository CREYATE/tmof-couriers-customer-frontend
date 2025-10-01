import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client: Client | null = null;

export const initializeWebSocket = (): Client => {
  if (client && client.connected) {
    return client;
  }

  // Use dedicated WS env var for protocol switching (ws:// local, wss:// prod)
  const wsUrl = process.env.NEXT_PUBLIC_BACKEND_WS_URL || "http://localhost:8080/ws";
  client = new Client({
    webSocketFactory: () => new SockJS(wsUrl),
    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem("jwt") || ""}`,
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      console.log("WebSocket connected for customer");
    },
    onDisconnect: () => {
      console.log("WebSocket disconnected for customer");
    },
    onStompError: (frame) => {
      console.error("WebSocket STOMP error:", frame);
    },
    onWebSocketClose: () => {
      console.log("WebSocket closed, attempting to reconnect...");
    },
    onWebSocketError: (error) => {
      console.error("WebSocket error:", error);
    },
  });

  client.activate();
  return client;
};

// Rest unchanged (subscribeToTopic and disconnectWebSocket)
export const subscribeToTopic = (
  client: Client,
  topic: string,
  callback: (message: IMessage) => void
) => {
  if (client.connected) {
    return client.subscribe(topic, callback, { id: topic });
  } else {
    console.warn("WebSocket not connected, attempting to subscribe after connection...");
    const subscription = client.onConnect = () => {
      console.log("WebSocket connected, subscribing to topic:", topic);
      client.subscribe(topic, callback, { id: topic });
    };
    return {
      unsubscribe: () => {
        if (client.connected) {
          client.unsubscribe(topic);
        }
      },
      id: topic,
    };
  }
};

export const disconnectWebSocket = () => {
  if (client) {
    client.deactivate();
    client = null;
    console.log("WebSocket client deactivated");
  }
};