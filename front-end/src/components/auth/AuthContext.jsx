import { Navigate } from "react-router-dom";
import { LOGIN_PATH } from "../Paths";
import { useSelector } from "react-redux";
import { AUTH_SUCCESS } from "../../redux/app/constants";

// eslint-disable-next-line react/prop-types
export function AuthOnly({ children }) {
  const authStatus = useSelector((state) => state.app.authStatus);
  if (authStatus !== AUTH_SUCCESS) {
    return <Navigate to={LOGIN_PATH} />;
  } else {
    return children;
  }
}
