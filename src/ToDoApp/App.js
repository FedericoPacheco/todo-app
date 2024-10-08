import './App.css';
import { ToDoCounter } from './Count/ToDoCounter';
import { ToDoSearch } from './Search/ToDoSearch';
import { ToDoList } from './List/ToDoList';
import { ToDoItem } from './List/ToDoItem';
import { CreateToDoButton} from './Create/CreateToDoButton';
import { CreateToDo } from './Create/CreateToDo';
import { useState } from 'react';

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

function useLocalStorage(itemKey, initialValue) {

  const getItem = () => {
    const storedItem = localStorage.getItem(itemKey);
    const parsedItem = storedItem? JSON.parse(storedItem) : initialValue;
    return parsedItem;
  }
  const saveItem = (newItem) => {
    setParsedItem(newItem);
    localStorage.setItem(itemKey, JSON.stringify(newItem));
  };

  const [parsedItem, setParsedItem] = useState(getItem());  
  return [parsedItem, saveItem];
}

function App() {

  // App state
  const [tab, setTab] = useState(DEFAULT_TAB);
  const [toDos, saveToDos] = useLocalStorage(LOCALSTORAGE_TODOS, DEFAULT_TODOS);
  let seq = toDos.length > 0? toDos[toDos.length - 1].id + 1 : 0; 
  
  const [searchValue, setSearchValue] = useState("");
  const [doSearch, setDoSearch] = useState(false);
  const [isCreateToDoVisible, setIsCreateToDoVisible] = useState(false);

  // Counter
  const completed = toDos.filter(todo => todo.state === COMPLETED).length;
  const total = toDos.length;

  // Search 
  const preprocessText = rawText => {
    // Remove numbers and special, non printable characters, and spanish characters
    const regex = /[\W\dáéíóúÁÉÍÓÚñÑ\s]/g;
    return rawText.replace(regex, "").toLowerCase();
  }

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

  console.log(toDos);

  return (
    <div className = "App">
      <ToDoCounter completed = {completed} total = {total}/>
      <ToDoSearch
        setDoSearch = {setDoSearch}
        setSearchValue = {setSearchValue}
      />
      <ToDoList
        tab = {tab} 
        setTab = {setTab}
      > 
        { toDos
          .filter(todo => todo.state === tab)
          // If the user wants to search specific todos, filter todos; otherwise return the whole array
          .filter(todo => doSearch? preprocessText(todo.text).includes(preprocessText(searchValue)): true)
          .map(todo => 
            <ToDoItem
              key = {todo.id} // Needed by react
              text = {todo.text}
              tab = {tab}
              onStateChange = {() => onStateChange(todo.id)}
              onDelete = {() => onDelete(todo.id)}  
            ></ToDoItem>
          )
        }
      </ToDoList>
      <CreateToDoButton setIsCreateToDoVisible = {setIsCreateToDoVisible}/>
      {isCreateToDoVisible && 
      <CreateToDo 
        onCreate = {onCreate}
      />}
    </div>
  );
}

export default App;
