import './App.css';
import { ToDoCounter } from './ToDoCounter';
import { ToDoSearch } from './ToDoSearch';
import { ToDoList } from './ToDoList';
import { ToDoItem } from './ToDoItem';
import { CreateToDoButton} from './CreateToDoButton';
import { CreateToDo } from './CreateToDo';
import { useState } from 'react';

 // Sequence number for ToDos
const initSeq = 4;

// States
export const PENDING_STR = "pending";
export const COMPLETED_STR = "completed";
const DEFAULT_TAB = PENDING_STR;

const DEFAULT_TODOS = [
  {id: 0, text: "Tarea 1", state: PENDING_STR},
  {id: 1, text: "Tarea 2", state: COMPLETED_STR},
  {id: 2, text: "Tarea 3", state: PENDING_STR},
  {id: 3, text: "Tarea 4", state: COMPLETED_STR},
];

function App() {
  const [tab, setTab] = useState(DEFAULT_TAB);
  const [seq, setSeq] = useState(initSeq);
  const [toDos, setToDos] = useState(DEFAULT_TODOS);
  const [searchValue, setSearchValue] = useState("");
  const [isCreateToDoVisible, setIsCreateToDoVisible] = useState(false);

  const completed = toDos.filter(todo => todo.state === COMPLETED_STR).length;
  const total = toDos.length;
  
  console.log(toDos);

  return (
    <div className = "App">
      <ToDoCounter completed = {completed} total = {total}/>
      <ToDoSearch/>
      <ToDoList
        tab = {tab} 
        setTab = {setTab}
      > 
        { toDos
          .filter(todo => todo.state === tab)
          .map(todo => 
            <ToDoItem
              key = {todo.id} // Needed by react
              id = {todo.id} 
              text = {todo.text}
              toDos = {toDos}
              setToDos = {setToDos}
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
