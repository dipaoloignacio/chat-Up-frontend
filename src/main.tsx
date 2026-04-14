import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./ChatApp.tsx";
import { AuthProvider } from "./auth/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
);
