import { isLoggedIn } from "../../server/user";
import { Navigate } from "react-router-dom";

export default function UserAuth({ children }) {
  return isLoggedIn() ? children : <Navigate to={"/login"} />;
}
