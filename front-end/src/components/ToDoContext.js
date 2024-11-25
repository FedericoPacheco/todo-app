import { useEffect, createContext, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getAllTodos, changeStateTodo, addTodo, deleteTodo } from "../redux/todos/actionFunctions";
import { PENDING, COMPLETED } from '../redux/todos/constants';
import { AUTH_SUCCESS } from "../redux/app/constants";

export const ToDoContext = createContext();

const DEFAULT_TAB = PENDING;

export function ToDoContextProvider({children}) {
  
    const dispatch = useDispatch();
    const authStatus = useSelector(state => state.app.authStatus);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (authStatus === AUTH_SUCCESS && !fetched) {
            dispatch(getAllTodos());
            setFetched(true);
        }
    }, [authStatus, dispatch, fetched]);

    // Todos state
    const toDos = Object.values(useSelector(state => state.todos.list));
    const [tab, setTab] = useState(DEFAULT_TAB);
    const [searchValue, setSearchValue] = useState("");
    const [doSearch, setDoSearch] = useState(false);
    const [isCreateToDoVisible, setIsCreateToDoVisible] = useState(false);

    // Counters
    const pending = toDos.filter(todo => todo.state === PENDING).length;
    const completed = toDos.filter(todo => todo.state === COMPLETED).length;
    const total = toDos.length;

    // Actions
    const onStateChange = (id) => { 
        const newToDoState = tab === PENDING? COMPLETED: PENDING;
        dispatch(changeStateTodo(id, newToDoState));
    }

    const onDelete = (id) => {
        dispatch(deleteTodo(id));
    }

    const onCreate = (description) => {
        dispatch(addTodo({
            text: description,
            state: tab
        }));
        setIsCreateToDoVisible(false);
    }

    return (
        <ToDoContext.Provider value = {{
            tab,
            setTab,
            searchValue,
            setSearchValue,
            doSearch,
            setDoSearch,
            isCreateToDoVisible,
            setIsCreateToDoVisible,
            pending,
            completed,
            total,
            onStateChange,
            onDelete,
            onCreate,
        }}> {children}
        </ToDoContext.Provider>
    );
}