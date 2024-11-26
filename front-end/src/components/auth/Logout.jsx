import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/app/actionFunctions";
import { LOGIN_PATH } from "../Paths";
import './Logout.css';
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AUTH_LS, INIT_AUTH_LS } from "../auth/Login";

export function Logout() {
    const dispatch = useDispatch();
    const authStatus = useSelector((state) => state.app.authStatus);
    const navigate = useNavigate();
    const { saveItem: saveAuth } = useLocalStorage(AUTH_LS, INIT_AUTH_LS);

    return (
        <button className = "logout-button" onClick = {() => {
            if (authStatus === "AUTH_SUCCESS") {
                dispatch(logout());
                saveAuth(INIT_AUTH_LS);
                navigate(LOGIN_PATH);
            }
        }}>Salir</button>
    );
}