import './Todos.css';
import { ToDoCounter } from './count/ToDoCounter';
import { ToDoSearch } from './search/ToDoSearch';
import { ToDoList } from './list/ToDoList';
import { CreateToDoButton} from './create/CreateToDoButton';
import { CreateToDo } from './create/CreateToDo';
import { useContext } from 'react';
import { ToDoContext } from './ToDoContext';
import { useSelector } from 'react-redux';
import { Logout } from '../auth/logout/Logout';

export function Todos() {

  const { isCreateToDoVisible } = useContext(ToDoContext);
  const todos = useSelector(state => state.todos.list);

  console.log("todos:", todos);
  
  return (
    <div className = "app">
      <ToDoCounter/>
      <ToDoSearch/>
      <ToDoList/>
      <CreateToDoButton/>
      <Logout/>
      {isCreateToDoVisible && <CreateToDo/>}
    </div>
  );
}
  