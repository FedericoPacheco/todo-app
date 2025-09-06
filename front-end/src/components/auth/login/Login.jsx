import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TODOS_PATH } from "../../Paths";
import { login, signup } from "../../../redux/app/actionFunctions";
import { AUTH_ERROR, AUTH_SUCCESS } from "../../../redux/app/constants";
import "./Login.scss";
import { getSessionStatus } from "../../../redux/app/actionFunctions";

export function Login() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.app.authStatus);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  useEffect(() => {
    dispatch(getSessionStatus());
  }, []);

  if (authStatus !== AUTH_SUCCESS) {
    return (
      <div>
        <div className="login">
          <h1>Ingrese sus credenciales</h1>
          <div className="credential-container">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              onChange={(e) => setUser(e.target.value)}
              value={user}
            />
          </div>
          <div className="credential-container">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              onChange={(e) => setPass(e.target.value)}
              type="password"
              value={pass}
            />
          </div>
        </div>
        <div className="button-and-error-container">
          <div className="button-container">
            <button onClick={() => dispatch(login(user, pass))}>Login</button>
            <button onClick={() => dispatch(signup(user, pass))}>
              Sign Up
            </button>
          </div>
          {authStatus === AUTH_ERROR && (
            <p>Credenciales incorrectas o usuario ya existente.</p>
          )}
        </div>
      </div>
    );
  } else {
    return <Navigate to={TODOS_PATH} />;
  }
}
