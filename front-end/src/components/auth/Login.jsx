import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TODOS_PATH } from '../Paths';
import { login } from '../../redux/app/actionFunctions';
import { AUTH_ERROR, AUTH_REQUIRED, AUTH_SUCCESS } from '../../redux/app/constants';
import './Login.css';
/*
import { useLocalStorage } from '../hooks/useLocalStorage';
 
export const AUTH_LS = "TODO_AUTH";
export const INIT_AUTH_LS = {user: "", pass: ""}; 
 */
export function Login() {
    const dispatch = useDispatch();
    const authStatus = useSelector((state) => state.app.authStatus);
    const [user, setUser] = useState("");

    const [pass, setPass] = useState("");
    
    /*
    // Try to retrieve credentials from local storage
    const {item: auth, saveItem: setAuth, error: LSError} = useLocalStorage(AUTH_LS, INIT_AUTH_LS);
    const [user, setUser] = useState(INIT_AUTH_LS.user);
    const [pass, setPass] = useState(INIT_AUTH_LS.pass);
    
    // If there were valid credentials in the local storage when initializing the component, try to login
    useEffect(() => {
        if (authStatus !== AUTH_SUCCESS && !LSError && auth?.user.length > 0 && auth?.pass.length > 0) {
            setUser(auth.user);
            setPass(auth.pass);
            dispatch(login(auth.user, auth.pass));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth]);
    
    // If the login was successful, save the credentials in the local storage
    useEffect(() => {
        if (authStatus === AUTH_SUCCESS) {
            setAuth({user: user, pass: pass});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authStatus]); */

    const validate = (e) => {
        e.preventDefault();
        dispatch(login(user, pass));
    } 

    // Login needed
    if (authStatus === AUTH_REQUIRED || authStatus === AUTH_ERROR) {
        return (
            <div className = "login">
                <h1 className = "login-title">Ingrese sus credenciales</h1>
                <form onSubmit = {validate}>
                    <label 
                        className = "credential-label">Usuario
                            <input 
                                className = "user"
                                onChange = {(e) => setUser(e.target.value)}
                                value = {user}
                            />
                    </label>
                    <label 
                        className = "credential-label">Contraseña
                        <input 
                            className = "pass"
                            onChange = {(e) => setPass(e.target.value) } 
                            type = "password"
                            value = {pass}
                        />
                    </label>
                    <button className = "login-button" type = "submit">Login</button>
                </form>
                {authStatus === AUTH_ERROR && <p className = "login-error-message">Credenciales incorrectas. Intente nuevamente.</p>}
            </div>
        );
    // Redirect to todos
    } else {
        return <Navigate to = {TODOS_PATH}/>
    }
}