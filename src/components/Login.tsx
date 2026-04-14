import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { TestUsers } from "./TestUsers";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async () => {
    const ok = await login(email, password);
    if (!ok) setError("Email o contraseña incorrectos");
  };

  const handleSelectTestUser = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      className="flex h-screen items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a0533, #2d1b69, #11001f)" }}
    >
      {/* Orbs */}
      <div className="pointer-events-none absolute"
        style={{ width: 300, height: 300, borderRadius: "50%", background: "rgba(139,92,246,0.15)", filter: "blur(60px)", top: -60, right: 80 }} />
      <div className="pointer-events-none absolute"
        style={{ width: 200, height: 200, borderRadius: "50%", background: "rgba(236,72,153,0.1)", filter: "blur(50px)", bottom: 40, left: 60 }} />

      {/* Card */}
      <div
        className="relative flex flex-col gap-4 w-80 p-8 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        {/* Título */}
        <div className="flex flex-col items-center gap-1 mb-2">
          <h1 className="text-2xl font-semibold text-white tracking-wide">Chat Up</h1>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            ingresá con tu cuenta
          </p>
        </div>

        {/* Error */}
        {error && (
          <p
            className="text-xs px-3 py-2 rounded-lg"
            style={{
              background: "rgba(255,107,107,0.12)",
              border: "1px solid rgba(255,107,107,0.25)",
              color: "#ff6b6b",
            }}
          >
            {error}
          </p>
        )}

        {/* Inputs */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-sm text-white outline-none px-4 py-2.5 rounded-full placeholder:text-white/25 transition-all"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-sm text-white outline-none px-4 py-2.5 rounded-full placeholder:text-white/25 transition-all"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        />

        {/* Botón */}
        <button
          onClick={handleLogin}
          className="text-sm font-medium py-2.5 rounded-full transition-all hover:brightness-125 active:scale-95"
          style={{
            background: "rgba(192,132,252,0.25)",
            border: "1px solid rgba(192,132,252,0.4)",
            color: "#e0c3fc",
          }}
        >
          ingresar
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <hr className="flex-1" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            usuarios de prueba
          </span>
          <hr className="flex-1" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
        </div>

        <TestUsers onSelect={handleSelectTestUser} />
      </div>
    </div>
  );
};