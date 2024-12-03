import { useDispatch } from "react-redux";
import { signup } from "../../../redux/app/actionFunctions";
import './Signup.css';

export function Signup({user, pass}) {
    const dispatch = useDispatch();
    return (
        <button className = "signup-button" onClick = {() => {
            dispatch(signup(user, pass));
        }}>Sign Up</button>
    );
}