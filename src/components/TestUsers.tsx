interface TestUser {
  name: string;
  email: string;
  password: string;
  initials: string;
  avatarStyle: React.CSSProperties;
}

const TEST_USERS: TestUser[] = [
  {
    name: "Juan",
    email: "juan@google.com",
    password: "123456",
    initials: "JU",
    avatarStyle: {
      background: "rgba(96,165,250,0.2)",
      border: "1px solid rgba(96,165,250,0.4)",
      color: "#93c5fd",
    },
  },
  {
    name: "María",
    email: "maria@google.com",
    password: "123456",
    initials: "MA",
    avatarStyle: {
      background: "rgba(52,211,153,0.2)",
      border: "1px solid rgba(52,211,153,0.4)",
      color: "#6ee7b7",
    },
  },
  {
    name: "Pedro",
    email: "pedro@google.com",
    password: "123456",
    initials: "PE",
    avatarStyle: {
      background: "rgba(192,132,252,0.2)",
      border: "1px solid rgba(192,132,252,0.4)",
      color: "#e0c3fc",
    },
  },
  {
    name: "Ana",
    email: "ana@google.com",
    password: "123456",
    initials: "AN",
    avatarStyle: {
      background: "rgba(251,191,36,0.2)",
      border: "1px solid rgba(251,191,36,0.4)",
      color: "#fde68a",
    },
  },
  {
    name: "Luis",
    email: "luis@google.com",
    password: "123456",
    initials: "LU",
    avatarStyle: {
      background: "rgba(251,113,133,0.2)",
      border: "1px solid rgba(251,113,133,0.4)",
      color: "#fca5a5",
    },
  },
];

interface Props {
  onSelect: (email: string, password: string) => void;
}

export const TestUsers = ({ onSelect }: Props) => {
  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {TEST_USERS.map((user) => (
          <button
            key={user.email}
            type="button"
            onClick={() => onSelect(user.email, user.password)}
            className="flex flex-col items-center p-2 rounded-xl transition-all hover:brightness-125 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mb-1"
              style={user.avatarStyle}
            >
              {user.initials}
            </div>
            <span
              className="text-xs truncate w-full text-center"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {user.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
