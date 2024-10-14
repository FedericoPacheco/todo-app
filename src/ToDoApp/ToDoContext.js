import { createContext, useState } from "react";
import { useLocalStorage } from './customHooks/useLocalStorage';

export const ToDoContext = createContext();

// Constants
export const PENDING = "pending";
export const COMPLETED = "completed";
export const LOCALSTORAGE_TODOS = "todos_v1";

// Initialization
const DEFAULT_TAB = PENDING;
// const DEFAULT_TODOS = [];
///*
const DEFAULT_TODOS = [
  {id: 0, text: "Tarea 1", state: PENDING},
  {id: 1, text: "Tarea 2", state: COMPLETED},
  {id: 2, text: "Tarea 3", state: PENDING},
  {id: 3, text: "Tarea 4", state: COMPLETED},
];
//*/

export function ToDoContextProvider({children}) {

    // App state
    const [tab, setTab] = useState(DEFAULT_TAB);
    const {item: toDos, saveItem: saveToDos, loading, error} = useLocalStorage(LOCALSTORAGE_TODOS, DEFAULT_TODOS);
    let seq = toDos.length > 0? toDos[toDos.length - 1].id + 1 : 0; 

    const [searchValue, setSearchValue] = useState("");
    const [doSearch, setDoSearch] = useState(false);
    const [isCreateToDoVisible, setIsCreateToDoVisible] = useState(false);

    // Counters
    const pending = toDos.filter(todo => todo.state === PENDING).length;
    const completed = toDos.filter(todo => todo.state === COMPLETED).length;
    const total = toDos.length;

    // Todo items
    const onStateChange = (id) => {
        const newState = tab === PENDING? COMPLETED: PENDING;
        const newToDos = [...toDos]
        newToDos.find(todo => todo.id === id).state = newState;
        saveToDos(newToDos);
    };
    const onDelete = (id) => {
        const newToDos = toDos.filter(todo => todo.id !== id);
        saveToDos(newToDos);
    };
    const onCreate = (description) => {
        const newToDos = [...toDos, {id: seq, text: description, state: tab}];
        saveToDos(newToDos);
        seq++;
        setIsCreateToDoVisible(false);
    }

    return (
        <ToDoContext.Provider value = {{
            tab,
            setTab,
            toDos,
            saveToDos,
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
            loading,
            error
        }}> {children}
        </ToDoContext.Provider>
    );
}