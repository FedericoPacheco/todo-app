import axios from 'axios';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (user, pass) => {
    try {
        console.log(`api: login(${user}, ${pass})`);
        await delay(1000);
        if (user === "admin" && pass === "admin") {
            return true;
        } else {
            return false;
        }
        /* const response = await axios.get(process.env.REACT_APP_AUTH_API_URL, {user, pass});
        console.log(`login(${user}, ${pass}): ${response.data.wasSuccessful ? "successful" : "auth error"}`);
        return response.data.wasSuccessful; */
    } catch (error) {
        console.error(`login(${user}, ${pass}): error: ${error}`);
        return false;
    }
};

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