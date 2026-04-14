import { use } from "react";
import { AuthContext } from "../auth/AuthContext";

export const useAuth = () => use(AuthContext);