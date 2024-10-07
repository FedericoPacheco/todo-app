
import './App.css';
import { ToDoCounter } from './ToDoCounter';
import { ToDoSearch } from './ToDoSearch';
import { ToDoList } from './ToDoList';
import { ToDoItem } from './ToDoItem';
import { CreateToDoButton} from './CreateToDoButton';

// state: pending, completed
const defaultToDos = [
  {key: 1, text: "Tarea 1", state: "pending"},
  {key: 2, text: "Tarea 2", state: "completed"},
  {key: 3, text: "Tarea 3", state: "pending"},
  {key: 4, text: "Tarea 4", state: "completed"},
];
const completed = defaultToDos.filter(todo => todo.state === "completed").length;
const total = defaultToDos.length;

function App() {
  return (
    <div className = "App">
      <ToDoCounter completed = {completed} total = {total}/>
      
      <ToDoSearch/>
      <ToDoList tab = "pending">
        { defaultToDos
          .filter(todo => todo.state === "pending")
          .map(todo => <ToDoItem key = {todo.key} text = {todo.text} state = {todo.state}/>)
        }
      </ToDoList>
      <CreateToDoButton/>
    </div>
  );
}

export default App;
