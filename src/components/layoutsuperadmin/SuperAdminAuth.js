import { isLoggedIn } from "../../server/user";
import { Navigate } from "react-router-dom";

export default function SuperAdminAuth({ children }) {
  return isLoggedIn() ? children : <Navigate to={"/login"} />;
}
