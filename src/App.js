import './App.css';
import { ToDoCounter } from './ToDoCounter';
import { ToDoSearch } from './ToDoSearch';
import { ToDoList } from './ToDoList';
import { ToDoItem } from './ToDoItem';
import { CreateToDoButton} from './CreateToDoButton';
import { CreateToDo } from './CreateToDo';
import { useState } from 'react';

// Todo states
export const PENDING_STR = "pending";
export const COMPLETED_STR = "completed";
const DEFAULT_TAB = PENDING_STR;


// Initialization of toDos and sequence number
/*
const INIT_SEQ = 0;
const DEFAULT_TODOS = [];
*/
///*
const INIT_SEQ = 4;
const DEFAULT_TODOS = [
  {id: 0, text: "Tarea 1", state: PENDING_STR},
  {id: 1, text: "Tarea 2", state: COMPLETED_STR},
  {id: 2, text: "Tarea 3", state: PENDING_STR},
  {id: 3, text: "Tarea 4", state: COMPLETED_STR},
];
//*/

function App() {
  // App state
  const [tab, setTab] = useState(DEFAULT_TAB);
  const [seq, setSeq] = useState(INIT_SEQ);
  const [toDos, setToDos] = useState(DEFAULT_TODOS);
  const [searchValue, setSearchValue] = useState("");
  const [doSearch, setDoSearch] = useState(false);
  const [isCreateToDoVisible, setIsCreateToDoVisible] = useState(false);

  // Counter
  const completed = toDos.filter(todo => todo.state === COMPLETED_STR).length;
  const total = toDos.length;

  // Search 
  const preprocessText = rawText => {
    // Remove numbers and special, non printable characters, and spanish characters
    const regex = /[\W\dáéíóúÁÉÍÓÚñÑ\s]/g;
    return rawText.replace(regex, "").toLowerCase();
  }

  // Todo items
  const onStateChange = (id) => {
    const newState = tab === PENDING_STR? COMPLETED_STR: PENDING_STR;
    const newToDos = [...toDos]
    newToDos.find(todo => todo.id === id).state = newState;
    setToDos(newToDos);
  };
  const onDelete = (id) => {
    setToDos(toDos.filter(todo => todo.id !== id));
  };

  console.log(toDos);

  return (
    <div className = "App">
      <ToDoCounter completed = {completed} total = {total}/>
      <ToDoSearch
        doSeach = {doSearch}
        setDoSearch = {setDoSearch}
        searchValue = {searchValue}
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
        seq = {seq}
        setSeq = {setSeq}
        toDos = {toDos} 
        setToDos = {setToDos} 
        setIsCreateToDoVisible = {setIsCreateToDoVisible}
      />}
    </div>
  );
}

export default App;
