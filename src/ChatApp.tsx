import { useAuth } from "./hooks/useAuth";
import { ChatWindow } from "./components/ChatWindow";
import { Login } from "./components/Login";
import { WebSocketProvider } from "./context/WebSocketContext";
import { LoadingScreen } from "./components/LoadingScreen";

function App() {
  const { auth, logout } = useAuth();
  console.log(auth)
  if (auth.checking) return <LoadingScreen />;
  if (!auth.logged) return <Login />;

  return (
    <WebSocketProvider>
      <ChatWindow onLogout={logout} />
    </WebSocketProvider>
  );
}

export default App;
