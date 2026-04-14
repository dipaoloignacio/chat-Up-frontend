import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./ChatApp.tsx";
import { WebSocketProvider } from "./context/WebSocketContext.tsx";
import { AuthProvider } from "./auth/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <WebSocketProvider url="ws://localhost:3201">
      <App />
    </WebSocketProvider>
  </AuthProvider>,
);
