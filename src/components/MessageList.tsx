import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../types/chat";
import { useSocketChat } from "../hooks/useSocketChat";
import { MessageBubble } from "./MessageBubble";
import { useAuth } from "../hooks/useAuth";

interface Props {
  selectedId: string | null;
  chatType: "group" | "direct" | null;
}

const playNotification = () => {
  const audio = new Audio("/sound.wav");
  audio.volume = 0.5;
  audio.play().catch(() => {});
};

// Skeleton de una burbuja de mensaje
const MessageSkeleton = ({ align }: { align: "left" | "right" }) => (
  <li
    className={`flex gap-2 items-end ${align === "right" ? "flex-row-reverse" : "flex-row"}`}
  >
    {/* Avatar */}
    {align === "left" && (
      <div
        className="rounded-full flex-shrink-0"
        style={{
          width: 28,
          height: 28,
          background: "rgba(255,255,255,0.07)",
          animation: "skeleton-pulse 1.4s ease-in-out infinite",
        }}
      />
    )}

    <div
      className={`flex flex-col gap-1 ${align === "right" ? "items-end" : "items-start"}`}
    >
      {/* Burbuja principal */}
      <div
        style={{
          height: 38,
          width: `${align === "right" ? 140 + Math.random() * 80 : 100 + Math.random() * 120}px`,
          borderRadius: 14,
          background: "rgba(255,255,255,0.06)",
          animation: "skeleton-pulse 1.4s ease-in-out infinite",
        }}
      />
      {/* Timestamp */}
      <div
        style={{
          height: 10,
          width: 40,
          borderRadius: 6,
          background: "rgba(255,255,255,0.04)",
          animation: "skeleton-pulse 1.4s ease-in-out infinite",
          animationDelay: "0.2s",
        }}
      />
    </div>
  </li>
);

// Lista de skeletons con alturas y alineaciones variadas para parecer natural
const SKELETON_PATTERN: Array<{ align: "left" | "right"; delay: string }> = [
  { align: "left",  delay: "0s" },
  { align: "left",  delay: "0.05s" },
  { align: "right", delay: "0.1s" },
  { align: "left",  delay: "0.15s" },
  { align: "right", delay: "0.2s" },
  { align: "right", delay: "0.25s" },
  { align: "left",  delay: "0.3s" },
  { align: "right", delay: "0.35s" },
];

const SkeletonList = () => (
  <>
    <style>{`
      @keyframes skeleton-pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.4; }
      }
    `}</style>
    <ul className="flex flex-col gap-3">
      {SKELETON_PATTERN.map((item, i) => (
        <div key={i} style={{ animationDelay: item.delay }}>
          <MessageSkeleton align={item.align} />
        </div>
      ))}
    </ul>
  </>
);

export const MessageList = ({ selectedId, chatType }: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { lastMessage, send } = useSocketChat();
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { auth } = useAuth();

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
            setIsLoading(false);
          } else {
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === incoming[0].id);
              if (exists) return prev;
              return [...prev, ...incoming];
            });
            setIsLoading(false);
          }
        }
        break;

      case "SEND_DIRECT_MESSAGES_RESPONSE":
        if (chatType === "direct") {
          if (lastMessage.payload.receiverId !== selectedId) break;
          setMessages(lastMessage.payload.messages ?? []);
          setIsLoading(false);
        }
        break;

      case "NEW_DIRECT_MESSAGE":
        const incoming = lastMessage.payload.messages[0];

        if (
          incoming.sender?.id !== auth.userId &&
          incoming.sender?.id !== selectedId
        ) {
          playNotification();
        }

        if (chatType === "direct") {
          if (
            lastMessage.payload.receiverId !== selectedId &&
            incoming.sender?.id !== selectedId
          )
            break;

          setMessages((prev) => {
            const exists = prev.some((m) => m.id === incoming.id);
            if (exists) return prev;
            return [...prev, incoming];
          });
        }
        break;

      case "ERROR":
        setError(lastMessage.payload.error);
        setIsLoading(false);
        break;
    }
  }, [lastMessage, chatType]);

  useEffect(() => {
    if (!selectedId) return;
    setMessages([]);
    setIsLoading(true);         // ← activa el skeleton al cambiar de chat
    setError(null);
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
    <div className="flex flex-col h-full">
      {!selectedId ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl opacity-20">💬</span>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
              seleccioná un chat para empezar
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
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

          {isLoading ? (
            <SkeletonList />
          ) : (
            <ul className="flex flex-col gap-3">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </ul>
          )}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};