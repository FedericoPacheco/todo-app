import axios from 'axios';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const SESSION_ID = "sid";
// Enable sending cookies with requests automatically
// Sails back end sends the cookie in the "Set-Cookie" header
axios.defaults.withCredentials = true; 

export const login = async (user, pass) => {
    try {
        console.log(`login(${user}, ${pass})`);
        const response = await axios.post("http://localhost:1340/auth/login", {user, pass});
        //const response = await axios.post(`${process.env.REACT_APP_AUTH_API_URL}/login`, {user, pass});
        const wasSuccessful = response.status === 200;
        console.log(`login(${user}, ${pass}): ${wasSuccessful? "successful" : "auth error"}`);
        return wasSuccessful;
    } catch (error) {
        console.error(`login(${user}, ${pass}): error: ${error}`);
        return false;
    }
};

export const logout = async () => {
    try {
        console.log("logout()");
        await axios.post("http://localhost:1340/auth/logout");
        //await axios.post(`${process.env.REACT_APP_AUTH_API_URL}`/logout);
        console.log("logout(): successful");
    } catch (error) {
        console.error(`logout(): error: ${error}`);
    }
}

export const signup = async (user, pass) => {
    try {
        console.log(`signup(${user}, ${pass})`);
        const response = await axios.post("http://localhost:1340/auth/signup", {user, pass});
        //const response = await axios.post(`${process.env.REACT_APP_AUTH_API_URL}/signup`, {user, pass});
        const wasSuccessful = response.status === 200;
        console.log(`login(${user}, ${pass}): ${wasSuccessful? "successful" : "auth error"}`);
        return wasSuccessful;       
    } catch (error) {
        console.error(`signup(${user}, ${pass}): error: ${error}`);
        return false;
    }
}

export const getSessionStatus = async () => {
    try {
        console.log("getSessionStatus()");
        const response = await axios.get("http://localhost:1340/auth/status");
        //const response = await axios.get(`${process.env.REACT_APP_AUTH_API_URL}/status`);
        console.log(`getSessionStatus(): ${response.data.isAuthenticated}`);
        return response.data.isAuthenticated;
    } catch (error) {
        console.error(`getSessionStatus(): error: ${error}`);
        return "error";
    }
}

export const getAllTodos = async () => {
    try {
        const response = await axios.get("http://localhost:1340/todo");
        //const response = await axios.get(process.env.REACT_APP_TODO_API_URL);
        console.log(`getAllTodos(): successful:`, response.data);
        const toDos = {};
        response.data.forEach(todo => {
            toDos[todo.id] = todo;
        });
        return {
            list: toDos,
            nextSeq: response.data.map(todo => todo.id).reduce((max, id) => Math.max(max, id)) + 1,
        }
    } catch (error) {
        console.error(`getAllTodos(): error: ${error}`);
    }
};

export const addTodo = async (todo) => {
    try {
        await axios.post("http://localhost:1340/todo", todo);
        //await axios.post(process.env.REACT_APP_TODO_API_URL, todo);
        console.log(`addTodo(${Object.values(todo).join(", ")}): successful`);
    } catch (error) {
        console.error(`addTodo(${Object.values(todo).join(", ")}): error: ${error}`);
    }
};

export const deleteTodo = async (id) => {
    console.log("api: deleteTodo(): id:", id);
    try {
        await axios.delete(`http://localhost:1340/todo/${id}`);
        //await axios.delete(`${process.env.REACT_APP_TODO_API_URL}/${id}`);
        console.log(`deleteTodo(${id}): successful`);
    } catch (error) {
        console.error(`deleteTodo(${id}): error: ${error}`);
    }
};

export const changeStateTodo = async (id, newTodoState) => {
    try {
        await axios.patch(`http://localhost:1340/todo/${id}`, {state: newTodoState});
        //await axios.patch(`${process.env.REACT_APP_TODO_API_URL}/${id}`, {state: newTodoState});
        console.log(`changeStateTodo(${id}, ${newTodoState}): successful`);
    } catch (error) {
        console.error(`changeStateTodo(${id}, ${newTodoState}): error: ${error}`);
    }
};