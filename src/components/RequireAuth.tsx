import type { JSX } from "react";
import { Navigate } from "react-router-dom";
type Props = {
  children: JSX.Element;
};

function RequireAuth({ children }: Props) {
  const token = localStorage.getItem("auth_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default RequireAuth;
