import { Client, IMessage } from "@stomp/stompjs";

// Re-export Client type for use in other components
export type { Client } from "@stomp/stompjs";

let client: Client | null = null;

export const initializeWebSocket = (): Client => {
  if (client && client.connected) {
    return client;
  }

  // Dynamic secure native WS URL
  let wsUrl;
  if (typeof window !== 'undefined') {
    const isSecure = window.location.protocol === 'https:';
    const protocol = isSecure ? 'wss' : 'ws';
    const backendHost = isSecure ? 'tmof-couriers.onrender.com' : 'localhost:8080';
    wsUrl = `${protocol}://${backendHost}/ws`;
  } else {
    // SSR fallback (unlikely for WS)
    wsUrl = process.env.NEXT_PUBLIC_BACKEND_WS_URL || 'ws://localhost:8080/ws';
  }
  console.log('Native WebSocket URL:', wsUrl);  // Debug: Confirm wss:// in prod console

  // Native WebSocket factory (no SockJS)
  const webSocketFactory = () => new WebSocket(wsUrl);

  client = new Client({
    webSocketFactory,  // Native WS here
    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      console.log('WebSocket connected for customer');
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected for customer');
    },
    onStompError: (frame) => {
      console.error('WebSocket STOMP error:', frame);
    },
    onWebSocketClose: () => {
      console.log('WebSocket closed, attempting to reconnect...');
    },
    onWebSocketError: (error) => {
      console.error('WebSocket error:', error);
    },
  });

  client.activate();
  return client;
};

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