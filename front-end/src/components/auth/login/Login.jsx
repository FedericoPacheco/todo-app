import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TODOS_PATH } from '../../Paths';
import { login } from '../../../redux/app/actionFunctions';
import { AUTH_ERROR, AUTH_SUCCESS } from '../../../redux/app/constants';
import './Login.css';
import { getSessionStatus } from '../../../redux/app/actionFunctions';
import { Signup } from '../signup/Signup';

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
            <div className = "login">
                <h1 className = "login-title">Ingrese sus credenciales</h1>
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
                <button className = "login-button" onClick = {() => dispatch(login(user, pass))}>Login</button>
                <Signup
                    user = {user}
                    pass = {pass}
                ></Signup>                
                {authStatus === AUTH_ERROR && <p className = "login-error-message">Credenciales incorrectas o usuario ya existente.</p>}
            </div>
        );
    } else {
        return <Navigate to = {TODOS_PATH}/>
    }
}