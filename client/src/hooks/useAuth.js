import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

// Any component can call useAuth() to get the user and the login functions
export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
