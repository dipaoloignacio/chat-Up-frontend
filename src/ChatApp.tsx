import { useAuth } from "./hooks/useAuth";
import { ChatWindow } from "./components/ChatWindow";
import { Login } from "./components/Login";
import { WebSocketProvider } from "./context/WebSocketContext";

function App() {
  const { auth, logout } = useAuth();

  if (auth.checking) return <div>Cargando...</div>;
  if (!auth.logged) return <Login />;

  return (
    <WebSocketProvider>
      <ChatWindow onLogout={logout} />
    </WebSocketProvider>
  );
}

export default App;
