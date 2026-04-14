import { useState } from "react";
import { useSocketChat } from "../hooks/useSocketChat";

interface Props {
  selectedId: string | null;
  chatType: "group" | "direct" | null;
}

export const MessageInput = ({ selectedId, chatType }: Props) => {
  const [content, setContent] = useState("");
  const { send } = useSocketChat();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const handleSend = () => {
    if (!selectedId || !content.trim()) return;

    if (chatType === "group") {
      send({ type: "SEND_GROUP_MESSAGE", payload: { content, groupId: selectedId } });
    } else {
      send({ type: "SEND_DIRECT_MESSAGE", payload: { content, receiverId: selectedId } });
    }
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div
      className="flex items-center gap-2 px-4 py-3"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.04)",
      }}
    >
      <input
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="escribir mensaje..."
        disabled={!selectedId}
        className="flex-1 text-sm text-white outline-none px-4 py-2 rounded-full transition-all placeholder:text-white/25 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      />
      <button
        onClick={handleSend}
        disabled={!selectedId || !content.trim()}
        className="text-sm px-5 py-2 rounded-full font-medium transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-125"
        style={{
          background: "rgba(192,132,252,0.2)",
          border: "1px solid rgba(192,132,252,0.35)",
          color: "#e0c3fc",
        }}
      >
        enviar
      </button>
    </div>
  );
};