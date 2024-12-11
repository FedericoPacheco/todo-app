import axios from 'axios';
//import { getHeaders } from '../app/api';

//const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllTodos = async () => {
    try {
        const response = await axios.get(process.env.REACT_APP_TODO_API_URL);
        console.log(`getAllTodos(): successful:`, response.data);
        const toDos = {};
        response.data.forEach(todo => {
            toDos[todo.id] = todo;
        });
        return {
            list: toDos,
            nextSeq: response.data.length > 0
                ? response.data.map(todo => todo.id).reduce((max, id) => Math.max(max, id)) + 1
                : 1
        }
    } catch (error) {
        console.error(`getAllTodos(): error: ${error}`);
    }
};

export const addTodo = async (todo) => {
    try {
        await axios.post(
            process.env.REACT_APP_TODO_API_URL, 
            todo,
        );
        console.log(`addTodo(${Object.values(todo).join(", ")}): successful`);
    } catch (error) {
        console.error(`addTodo(${Object.values(todo).join(", ")}): error: ${error}`);
    }
};

export const deleteTodo = async (id) => {
    console.log("api: deleteTodo(): id:", id);
    try {
        await axios.delete(
            `${process.env.REACT_APP_TODO_API_URL}/${id}`,
        );
        console.log(`deleteTodo(${id}): successful`);
    } catch (error) {
        console.error(`deleteTodo(${id}): error: ${error}`);
    }
};

export const changeStateTodo = async (id, newTodoState) => {
    try {
        await axios.patch(
            `${process.env.REACT_APP_TODO_API_URL}/${id}`, 
            {state: newTodoState},
        );
        console.log(`changeStateTodo(${id}, ${newTodoState}): successful`);
    } catch (error) {
        console.error(`changeStateTodo(${id}, ${newTodoState}): error: ${error}`);
    }
};