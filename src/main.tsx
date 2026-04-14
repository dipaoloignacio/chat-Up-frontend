import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./ChatApp.tsx";
import { WebSocketProvider } from "./context/WebSocketContext.tsx";
import { AuthProvider } from "./auth/AuthContext.tsx";

const token = localStorage.getItem("token") ?? "";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <WebSocketProvider
      url={`wss://chatup-api.dipaoloproyects.space?token=${token}`}
    >
      <App />
    </WebSocketProvider>
  </AuthProvider>,
);
