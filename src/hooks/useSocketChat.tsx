import { use } from "react";
import { WebSocketContext } from "../context/WebSocketContext";

export const useSocketChat = () => {
  const { status, send, lastMessage, disconnect, defaultGroup } =
    use(WebSocketContext);

  return {
    status,
    send,
    lastMessage,
    disconnect,
    defaultGroup,
  };
};
