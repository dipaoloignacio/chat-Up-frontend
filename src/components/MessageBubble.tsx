import { useAuth } from "../hooks/useAuth";
import type { ChatMessage } from "../types/chat";

interface Props {
  message: ChatMessage;
}

export const MessageBubble = ({ message }: Props) => {
  const date = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const { auth } = useAuth();
  const isMe = message.sender.id === auth.userId;

  return (
    <li className={`flex flex-col max-w-xs gap-0.5 break-words ${isMe ? "self-end" : "self-start"}`}>
      <span
        className="text-xs font-medium px-1"
        style={{ color: isMe ? "#67e8f9" : "#c084fc" }}
      >
        {isMe ? "tú" : message.sender.name}
      </span>

      <div
        className="text-sm px-3 py-2 leading-relaxed break-words whitespace-pre-wrap"
        style={
          isMe
            ? {
                background: "rgba(103,232,249,0.08)",
                border: "1px solid rgba(103,232,249,0.2)",
                borderRadius: "10px 0 10px 10px",
                color: "#a5f3fc",
              }
            : {
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0 10px 10px 10px",
                color: "rgba(255,255,255,0.7)",
              }
        }
      >
        {message.content}
      </div>

      <span
        className="text-xs px-1 self-end"
        style={{ color: "rgba(255,255,255,0.2)" }}
      >
        {date}
      </span>
    </li>
  );
};