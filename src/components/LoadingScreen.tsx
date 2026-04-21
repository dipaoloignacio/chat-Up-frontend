export const LoadingScreen = () => {
  return (
    <div
      className="flex h-screen items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a0533, #2d1b69, #11001f)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: "16px",
        }}
      >
        <div className="spinner" />
        <p
          style={{
            fontSize: "14px",
            color: "white",
            margin: 0,
          }}
        >
          Iniciando sesión...
        </p>
      </div>
    </div>
  );
};
