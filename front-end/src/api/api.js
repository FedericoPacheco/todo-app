//import axios from 'axios';
import { PENDING, COMPLETED } from '../redux/todos/constants';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllTodos = async () => {
    try {
        /* const response = await axios.get('/todo');
        return response.data; */
        await delay(1000);
        console.log(`getAllTodos(): successful`);
        return {
            list: {
                0: {id: 0, text: "Leer libros de sw eng", state: COMPLETED},
                1: {id: 1, text: "Convertirme en fullstack", state: COMPLETED},
                2: {id: 2, text: "Ser founder", state: PENDING},
                3: {id: 3, text: "Ganar en grande", state: PENDING},
            },
            nextSeq: 4,
        };
    } catch (error) {
        console.error(`getAllTodos(): error: ${error}`);
    }
};

export const addTodo = async ({ todo }) => {
    try {
        /* const response = await axios.post('/todo', todo); */
        await delay(1000);
        console.log(`addTodo(${JSON.stringify(todo)}): successful`);
    } catch (error) {
        console.error(`addTodo(${JSON.stringify(todo)}): error: ${error}`);
    }
};

export const deleteTodo = async ({id}) => {
    try {
        /* const response = await axios.delete(`/todo/${id}`); */
        await delay(1000);
        console.log(`deleteTodo(${id}): successful`);
    } catch (error) {
        console.error(`deleteTodo(${id}): error: ${error}`);
    }
};

export const changeStateTodo = async ({id, newTodoState}) => {
    try {
        /* const response = await axios.patch(`/todo/${id}`, newTodoState); */
        await delay(1000);
        console.log(`changeStateTodo(${id}, ${newTodoState}): successful`);
    } catch (error) {
        console.error(`changeStateTodo(${id}, ${newTodoState}): error: ${error}`);
    }
};