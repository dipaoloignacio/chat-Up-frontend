import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../types/chat";
import { useSocketChat } from "../hooks/useSocketChat";
import { MessageBubble } from "./MessageBubble";

interface Props {
  selectedId: string | null;
  chatType: "group" | "direct" | null;
}

export const MessageList = ({ selectedId, chatType }: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { lastMessage, send } = useSocketChat();
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case "SEND_GROUP_MESSAGES_RESPONSE":
        if (chatType === "group") {
          const incoming = lastMessage.payload.messages;
          if (incoming.length > 1) {
            setMessages(incoming);
          } else {
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === incoming[0].id);
              if (exists) return prev;
              return [...prev, ...incoming];
            });
          }
        }
        break;
      case "SEND_DIRECT_MESSAGES_RESPONSE":
        if (chatType === "direct") {
          const incoming = lastMessage.payload.messages;
          if (!incoming?.length) break;
          if (incoming.length > 1) {
            setMessages(incoming);
          } else {
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === incoming[0].id);
              if (exists) return prev;
              return [...prev, ...incoming];
            });
          }
        }
        break;
      case "ERROR":
        setError(lastMessage.payload.error);
        break;
    }
  }, [lastMessage, chatType]);

  useEffect(() => {
    if (!selectedId) return;
    setMessages([]);
    if (chatType === "group") {
      send({ type: "GET_GROUP_MESSAGES", payload: { groupId: selectedId } });
    } else {
      send({
        type: "GET_DIRECT_MESSAGES",
        payload: { receiverId: selectedId },
      });
    }
  }, [selectedId]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
      {!selectedId ? (
        <div className="flex-1 flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl opacity-20">💬</span>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
              seleccioná un chat para empezar
            </p>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <p
              className="text-xs px-3 py-2 rounded-lg"
              style={{
                background: "rgba(255,107,107,0.12)",
                border: "1px solid rgba(255,107,107,0.25)",
                color: "#ff6b6b",
              }}
            >
              {error}
            </p>
          )}
          <ul className="flex flex-col gap-3">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </ul>
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
};
