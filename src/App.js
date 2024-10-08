import './App.css';
import { ToDoCounter } from './ToDoCounter';
import { ToDoSearch } from './ToDoSearch';
import { ToDoList } from './ToDoList';
import { ToDoItem } from './ToDoItem';
import { CreateToDoButton} from './CreateToDoButton';
import { CreateToDo } from './CreateToDo';
import { useState } from 'react';

// Constants
export const PENDING = "pending";
export const COMPLETED = "completed";
export const LOCALSTORAGE_TODOS = "todos_v1";

// Initialization
let initSeq;
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

function App() {
  
  // Persistence
  const saveToDos = (newToDos) => {
    localStorage.removeItem(LOCALSTORAGE_TODOS);
    localStorage.setItem(LOCALSTORAGE_TODOS, JSON.stringify(newToDos));
  };
  const getToDos = () => {
    const storedToDos = localStorage.getItem(LOCALSTORAGE_TODOS);
    const parsedToDos = storedToDos? JSON.parse(storedToDos) : DEFAULT_TODOS;
    initSeq = parsedToDos.length > 0? parsedToDos[parsedToDos.length - 1].id + 1 : 0;
    return parsedToDos;
  }
  
  // App state
  const [tab, setTab] = useState(DEFAULT_TAB);
  const [toDos, setToDos] = useState(getToDos());
  const [seq, setSeq] = useState(initSeq);
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
    setToDos(newToDos);
    saveToDos(newToDos);
  };
  const onDelete = (id) => {
    const newToDos = toDos.filter(todo => todo.id !== id);
    setToDos(newToDos);
    saveToDos(newToDos);
  };
  const onCreate = (description) => {
    const newToDos = [...toDos, {id: seq, text: description, state: PENDING}];
    setToDos(newToDos);
    saveToDos(newToDos);
    setSeq(seq + 1);
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
