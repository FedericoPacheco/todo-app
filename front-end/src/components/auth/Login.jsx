import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TODOS_PATH } from '../app/Paths';
import { login } from '../../redux/app/actionFunctions';
import { AUTH_ERROR, AUTH_REQUIRED } from '../../redux/app/constants';

// TODO: add basic styles
export function Login() {
    const dispatch = useDispatch();
    const authStatus = useSelector((state) => state.app.authStatus);
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    
    const validate = (e) => {
        e.preventDefault();
        dispatch(login(user, pass));
    }

    // i.e. you have to login
    if (authStatus === AUTH_REQUIRED) {
        return (
            <>
                <h1>Login</h1>
                <form onSubmit = {validate}>
                    <label>User: <input
                        onChange = {(e) => setUser(e.target.value)}
                    /></label>
                    <label>Pass: <input
                        onChange = {(e) => setPass(e.target.value)}
                    /></label>
                    <button type = "submit">Login</button>
                </form>
                {authStatus === AUTH_ERROR && <p>Wrong credentials. Try again.</p>}
            </>
        );
    // i.e. don't login again
    } else {
        return <Navigate to = {TODOS_PATH}/>
    }
}