import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ChatMessage, Sender } from "../types/chat";

type ConexionStatus = "connecting" | "connected" | "disconnected" | "error";

export type ClientMessage =
  | {
      type: "SEND_GROUP_MESSAGE";
      payload: { content: string; groupId: string };
    }
  | {
      type: "SEND_DIRECT_MESSAGE";
      payload: { content: string; receiverId: string };
    }
  | { type: "GET_GROUP_MESSAGES"; payload: { groupId: string } }
  | { type: "GET_DIRECT_MESSAGES"; payload: { receiverId: string } };

export type ServerMessage =
  | {
      type: "WELCOME";
      payload: {
        userId: string;
        clientId: string;
        name: string;
        email: string;
      };
    }
  | { type: "ERROR"; payload: { error: string } }
  | {
      type: "SEND_GROUP_MESSAGES_RESPONSE";
      payload: { groupId: string; messages: ChatMessage[] };
    }
  | {
      type: "SEND_DIRECT_MESSAGES_RESPONSE";
      payload: {
        receiverId: string;
        senderId: string;
        messages: ChatMessage[];
      };
    }
  | { type: "SEND_CONNECTED_USERS_RESPONSE"; payload: { users: Sender[] } };

interface WebSocketContextState {
  status: ConexionStatus;
  send: (message: ClientMessage) => void;
  lastMessage: ServerMessage | null;
  disconnect: () => void;
  defaultGroup: { id: string; name: string } | null;
}

export const WebSocketContext = createContext({} as WebSocketContextState);

interface Props {
  children: ReactNode;
  url?: string;
}

export const WebSocketProvider = ({ children }: Props) => {
  const [status, setStatus] = useState<ConexionStatus>("connecting");
  const [lastMessage, setLastMessage] = useState<ServerMessage | null>(null);
  const [defaultGroup, setDefaultGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    // Cerrar conexión anterior si existe
    if (socketRef.current) {
      socketRef.current.onclose = null;
      socketRef.current.close();
    }

    const token = localStorage.getItem("token") ?? "";
    const ws = new WebSocket(
      `wss://chatup-api.dipaoloproyects.space?token=${token}`,
    );
    socketRef.current = ws;

    ws.onopen = () => setStatus("connected");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLastMessage(data);
      if (data.type === "SEND_GROUP_MESSAGES_RESPONSE") {
        setDefaultGroup({ id: data.payload.groupId, name: "Chat del grupo" });
      }
    };

    ws.onerror = () => setStatus("error");

    ws.onclose = () => {
      setStatus("disconnected");
      // Reconectar una sola vez después de 3s
      reconnectTimeout.current = setTimeout(() => {
        connect();
      }, 3000);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
      }
    };
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    if (socketRef.current) {
      socketRef.current.onclose = null;
      socketRef.current.close();
    }
    setStatus("disconnected");
  }, []);

  const send = useCallback(
    (message: ClientMessage) => {
      if (!socketRef.current || status !== "connected") return;
      socketRef.current.send(JSON.stringify(message));
    },
    [status],
  );

  return (
    <WebSocketContext
      value={{ status, send, lastMessage, disconnect, defaultGroup }}
    >
      {children}
    </WebSocketContext>
  );
};
