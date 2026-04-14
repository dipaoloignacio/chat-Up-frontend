import { useEffect, useState } from "react";
import { useSocketChat } from "../hooks/useSocketChat";
import type { Sender } from "../types/chat";
import { useAuth } from "../hooks/useAuth";

interface Props {
  onSelect: (id: string, type: "group" | "direct") => void;
}

export const Sidebar = ({ onSelect }: Props) => {
  const { lastMessage, defaultGroup } = useSocketChat();
  const [userConnected, setUserConnected] = useState<Sender[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { auth } = useAuth();

  useEffect(() => {
    if (!lastMessage) return;
    if (lastMessage.type === "SEND_CONNECTED_USERS_RESPONSE") {
      setUserConnected(lastMessage.payload.users);
    }
  }, [lastMessage]);

  const handleSelect = (id: string, type: "group" | "direct") => {
    setActiveId(id);
    onSelect(id, type);
  };

  return (
    <div className="flex flex-col overflow-y-auto flex-1">

      <p className="text-xs px-3 pt-3 pb-1 tracking-widest uppercase"
        style={{ color: "rgba(255,255,255,0.25)", fontSize: "9px" }}>
        // grupos
      </p>

      {defaultGroup && (
        <button
          onClick={() => handleSelect(defaultGroup.id, "group")}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-left w-full mx-1.5 rounded-lg transition-all"
          style={activeId === defaultGroup.id
            ? { background: "rgba(192,132,252,0.12)", color: "#e0c3fc", border: "1px solid rgba(192,132,252,0.2)" }
            : { color: "rgba(255,255,255,0.35)", border: "1px solid transparent" }
          }
        >
          <span style={{ color: "rgba(192,132,252,0.5)" }}>#</span>
          {defaultGroup.name}
        </button>
      )}

      <hr className="my-2 mx-3" style={{ borderColor: "rgba(255,255,255,0.06)" }} />

      <p className="text-xs px-3 pb-1 tracking-widest uppercase"
        style={{ color: "rgba(255,255,255,0.25)", fontSize: "9px" }}>
        // conectados
      </p>

      {userConnected
        .filter(u => u.id !== auth.userId)
        .map(user => (
          <button
            key={user.id}
            onClick={() => handleSelect(user.id, "direct")}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-left w-full mx-1.5 rounded-lg transition-all"
            style={activeId === user.id
              ? { background: "rgba(192,132,252,0.12)", color: "#e0c3fc", border: "1px solid rgba(192,132,252,0.2)" }
              : { color: "rgba(255,255,255,0.35)", border: "1px solid transparent" }
            }
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 dot-online"
              style={{ background: "#a3e635" }} />
            {user.name}
          </button>
        ))}
    </div>
  );
};