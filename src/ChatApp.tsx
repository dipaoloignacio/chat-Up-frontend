import { useAuth } from "./hooks/useAuth";
import { useSocketChat } from "./hooks/useSocketChat";
import { ChatWindow } from "./components/ChatWindow";
import { Login } from "./components/Login";

function App() {
  const { auth, logout } = useAuth();
  const { disconnect } = useSocketChat();

  if (auth.checking) return <div>Cargando...</div>;
  if (!auth.logged) return <Login />;

  const handleLogout = () => {
    disconnect();
    logout();
  };

  return <ChatWindow onLogout={handleLogout} />;
}

export default App;