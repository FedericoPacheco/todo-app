import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/app/actionFunctions";
import { LOGIN_PATH } from "../app/Paths";

// TODO: make logout button
export function Logout() {
    const dispatch = useDispatch();
    const authStatus = useSelector((state) => state.app.authStatus);
    
    useEffect(() => {
        if (authStatus === "AUTH_SUCCESS") { 
            dispatch(logout());
        }
    }, [authStatus, dispatch]);
 
    return <Navigate to = {LOGIN_PATH}/>
}