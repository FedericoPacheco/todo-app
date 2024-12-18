import axios from 'axios';

//const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (user, pass) => {
    try {
        console.debug(`login(${user}, ${pass})`);
        const response = await axios.post(
            `${process.env.REACT_APP_AUTH_API_URL}/login`, 
            {user, pass},
        );
        const wasSuccessful = response.status === 200;
        console.debug(`login(${user}, ${pass}): ${wasSuccessful? "successful" : "auth error"}`);
        return wasSuccessful;
    } catch (error) {
        console.error(`login(${user}, ${pass}): error: ${error}`);
        return false;
    }
};

export const logout = async () => {
    try {
        console.debug("logout()");
        await axios.post(
            `${process.env.REACT_APP_AUTH_API_URL}/logout`,
        );
        console.debug("logout(): successful");
    } catch (error) {
        console.error(`logout(): error: ${error}`);
    }
}

export const signup = async (user, pass) => {
    try {
        console.debug(`signup(${user}, ${pass})`);
        const response = await axios.post(
            `${process.env.REACT_APP_AUTH_API_URL}/signup`, 
            {user, pass},
        );
        const wasSuccessful = response.status === 200;
        console.debug(`login(${user}, ${pass}): ${wasSuccessful? "successful" : "auth error"}`);
        return wasSuccessful;       
    } catch (error) {
        console.error(`signup(${user}, ${pass}): error: ${error}`);
        return false;
    }
}

export const getSessionStatus = async () => {
    try {
        console.debug("getSessionStatus()");
        //const response = await axios.get("http://localhost:1340/auth/status");
        const response = await axios.get(
            `${process.env.REACT_APP_AUTH_API_URL}/status`,
            //await getHeaders()
        );
        console.debug(`getSessionStatus(): ${response.data.isAuthenticated}`);
        return response.data.isAuthenticated;
    } catch (error) {
        console.error(`getSessionStatus(): error: ${error}`);
        return false;
    }
}

export const getCsrfToken = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_AUTH_API_URL}/csrf`);
        return response.data.csrfToken;
    } catch (error) {
        console.error('getCsrfToken(): error:', error);
        return null;
    }
};
