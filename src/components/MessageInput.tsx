import { useState, useRef } from "react";
import { useSocketChat } from "../hooks/useSocketChat";

interface Props {
  selectedId: string | null;
  chatType: "group" | "direct" | null;
}

export const MessageInput = ({ selectedId, chatType }: Props) => {
  const [content, setContent] = useState("");
  const { send } = useSocketChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const handleSend = () => {
    if (!selectedId || !content.trim()) return;

    if (chatType === "group") {
      send({
        type: "SEND_GROUP_MESSAGE",
        payload: { content, groupId: selectedId },
      });
    } else {
      send({
        type: "SEND_DIRECT_MESSAGE",
        payload: { content, receiverId: selectedId },
      });
    }
    setContent("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex items-end gap-2 px-4 py-3"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.04)",
      }}
    >
      <style>{`textarea::-webkit-scrollbar { display: none; }`}</style>

      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="escribir mensaje..."
        disabled={!selectedId}
        rows={1}
        className="flex-1 text-sm text-white outline-none px-4 py-2 rounded-2xl transition-all placeholder:text-white/25 disabled:opacity-40 disabled:cursor-not-allowed resize-none overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          maxHeight: "120px",
          overflowY: "auto",
          lineHeight: "1.5",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      />
      <button
        onClick={handleSend}
        disabled={!selectedId || !content.trim()}
        className="text-sm px-5 py-2 rounded-full font-medium transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-125 flex-shrink-0"
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
