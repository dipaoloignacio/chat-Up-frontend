import {
  createContext,
  useCallback,
  useEffect,
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
      }; // 👈
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
  url: string;
}

export const WebSocketProvider = ({ children }: Props) => {
  const [status, setStatus] = useState<ConexionStatus>("connecting");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<ServerMessage | null>(null);
  const [defaultGroup, setDefaultGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const connect = useCallback(() => {
    const token = localStorage.getItem("token") ?? "";
    const socket = new WebSocket(
      `wss://chatup-api.dipaoloproyects.space?token=${token}`,
    );

    socket.onopen = () => setStatus("connected");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLastMessage(data);
      if (data.type === "SEND_GROUP_MESSAGES_RESPONSE") {
        setDefaultGroup({ id: data.payload.groupId, name: "Chat del grupo" });
      }
    };
    socket.onerror = () => setStatus("error");
    socket.onclose = () => setStatus("disconnected");

    return socket;
  }, []); // ← sin dependencias

  useEffect(() => {
    const socket = connect();
    setSocket(socket);
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [connect]);

  const disconnect = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  }, [socket]);

  //funcion de re-coneccion
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (status === "disconnected") {
      timeout = setTimeout(() => {
        const newSocket = connect();
        setSocket(newSocket);
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [status, connect]);

  const send = useCallback(
    (message: ClientMessage) => {
      if (!socket) throw new Error("Socket not connected");
      if (status !== "connected") throw new Error("Socket not connected");

      const jsonMessage = JSON.stringify(message);
      socket.send(jsonMessage);
    },
    [socket, status],
  );

  return (
    <WebSocketContext
      value={{
        status: status,
        send: send,
        lastMessage: lastMessage,
        disconnect,
        defaultGroup,
      }}
    >
      {children}
    </WebSocketContext>
  );
};
