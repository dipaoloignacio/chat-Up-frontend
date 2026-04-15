import { useState } from "react";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../hooks/useAuth";

interface Props {
  onLogout: () => void;
}

export const ChatWindow = ({ onLogout }: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [chatType, setChatType] = useState<"group" | "direct" | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { auth } = useAuth();

  const handleSelect = (id: string, type: "group" | "direct") => {
    setSelectedId(id);
    setChatType(type);
    setSidebarOpen(false);
  };

  //classname
  const sidebarClass = [
    "glass-panel flex flex-col w-64 z-[20]",
    "fixed inset-y-0 left-0 transition-transform duration-200",
    "sm:relative sm:translate-x-0",
    sidebarOpen ? "translate-x-0" : "-translate-x-full",
  ].join(" ");

  return (
    <div
      className="glass-bg relative flex items-center justify-center"
      style={{ height: "100dvh" }}
    >
      {/* Orbs */}
      <div className="orb-purple" />
      <div className="orb-pink" />

      {/* Contenedor centrado */}
      <div
        className="relative flex w-full max-w-5xl h-full sm:h-screen sm:rounded-2xl sm:shadow-2xl overflow-hidden"
        style={{ maxHeight: "100dvh" }}
      >
        {/* 1 — OVERLAY z-[15] */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-[15] sm:hidden"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 2 — SIDEBAR z-[20] */}

        <div
          className={sidebarClass}
          style={
            sidebarOpen
              ? {
                  background: "rgba(10, 3, 25, 0.99)",
                  backdropFilter: "blur(20px)",
                }
              : {}
          }
        >
          <div
            className="flex items-center gap-2 p-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span
              className="flex-1 text-xs px-3 py-1 rounded-full truncate"
              style={{
                background: "rgba(192,132,252,0.15)",
                border: "1px solid rgba(192,132,252,0.25)",
                color: "#e0c3fc",
              }}
            >
              {auth.name}
            </span>
            <button
              onClick={onLogout}
              className="text-xs px-2 py-1 rounded-full whitespace-nowrap hover:brightness-125"
              style={{
                background: "rgba(255,107,107,0.12)",
                border: "1px solid rgba(255,107,107,0.25)",
                color: "#ff6b6b",
              }}
            >
              salir
            </button>
          </div>
          <Sidebar onSelect={handleSelect} />
        </div>

        {/* 3 — CHAT z-[10] */}
        <div className="glass-panel-light flex flex-col flex-1 min-w-0 relative z-[10] h-full min-h-0">
          {/* Header mobile */}
          <div
            className="sticky flex items-center gap-3 px-4 py-2 sm:hidden flex-shrink-0"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-base"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              ☰
            </button>
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {selectedId ? "# chat" : "seleccioná un canal"}
            </span>
          </div>

          {/* Mensajes — crece y scrollea */}
          <div className="flex-1 min-h-0 flex overflow-y-auto">
            <MessageList selectedId={selectedId} chatType={chatType} />
          </div>

          {/* Input — siempre abajo */}
          <div className="flex-shrink-0">
            <MessageInput selectedId={selectedId} chatType={chatType} />
          </div>
        </div>
      </div>
    </div>
  );
};
