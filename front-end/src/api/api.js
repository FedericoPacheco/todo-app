import axios from 'axios';

// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllTodos = async () => {
    try {
        console.log(process.env.REACT_APP_TODO_API_URL);
        // const response = await axios.get(process.env.REACT_APP_TODO_API_URL);
        const response = await fetch(process.env.REACT_APP_TODO_API_URL);
        console.log("response:", response);
        const data = await response.json();
        console.log(`getAllTodos(): successful:`, response.data);
        return {
            list: data,//response.data,
            nextSeq: data.map(todo => todo.id).reduce((max, id) => Math.max(max, id)) + 1,
        }
        /* await delay(1000);
        return {
            list: {
                0: {id: 0, text: "Leer libros de sw eng", state: COMPLETED},
                1: {id: 1, text: "Convertirme en fullstack", state: COMPLETED},
                2: {id: 2, text: "Ser founder", state: PENDING},
                3: {id: 3, text: "Ganar en grande", state: PENDING},
            },
            nextSeq: 4,
        }; */
    } catch (error) {
        console.error(`getAllTodos(): error: ${error}`);
    }
};

export const addTodo = async ({ todo }) => {
    try {
        await axios.post(process.env.REACT_APP_TODO_API_URL, todo);
        // await delay(1000);
        console.log(`addTodo(${JSON.stringify(todo)}): successful`);
    } catch (error) {
        console.error(`addTodo(${JSON.stringify(todo)}): error: ${error}`);
    }
};

export const deleteTodo = async ({id}) => {
    try {
        await axios.delete(`${process.env.REACT_APP_TODO_API_URL}/${id}`);
        // await delay(1000);
        console.log(`deleteTodo(${id}): successful`);
    } catch (error) {
        console.error(`deleteTodo(${id}): error: ${error}`);
    }
};

export const changeStateTodo = async ({id, newTodoState}) => {
    try {
        await axios.patch(`${process.env.REACT_APP_TODO_API_URL}/${id}`, {state: newTodoState});
        // await delay(1000);
        console.log(`changeStateTodo(${id}, ${newTodoState}): successful`);
    } catch (error) {
        console.error(`changeStateTodo(${id}, ${newTodoState}): error: ${error}`);
    }
};