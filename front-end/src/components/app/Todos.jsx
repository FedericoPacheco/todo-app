import './Todos.css';
import { ToDoCounter } from '../count/ToDoCounter';
import { ToDoSearch } from '../search/ToDoSearch';
import { ToDoList } from '../list/ToDoList';
import { CreateToDoButton} from '../create/CreateToDoButton';
import { CreateToDo } from '../create/CreateToDo';
import { useContext } from 'react';
import { ToDoContext } from '../ToDoContext';
import { useSelector } from 'react-redux';
import { AUTH_SUCCESS } from '../../redux/app/constants';
import { Navigate } from 'react-router-dom';
import { LOGIN_PATH } from './Paths';

export function Todos() {

  const { isCreateToDoVisible } = useContext(ToDoContext);
  const todos = useSelector(state => state.todos.list);
  const authStatus = useSelector(state => state.app.authStatus);

  console.log("todos:", todos);
  
  if (authStatus === AUTH_SUCCESS) {
    return (
      <div className = "app">
        <ToDoCounter/>
        <ToDoSearch/>
        <ToDoList/>
        <CreateToDoButton/>
        {isCreateToDoVisible && <CreateToDo/>}
      </div>
    );
  } else {
    return <Navigate to = {LOGIN_PATH}/>
  }
}
  