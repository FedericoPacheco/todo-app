import './AppUI.css';
import { ToDoCounter } from '../count/ToDoCounter';
import { ToDoSearch } from '../search/ToDoSearch';
import { ToDoList } from '../list/ToDoList';
import { CreateToDoButton} from '../create/CreateToDoButton';
import { CreateToDo } from '../create/CreateToDo';
import { useContext } from 'react';
import { ToDoContext } from '../ToDoContext';
import { useSelector } from 'react-redux';

function AppUI() {

    const { isCreateToDoVisible } = useContext(ToDoContext);
    const state = useSelector(state => state);
    
    console.log("state:", state);
    
    return (
      <div className = "app">
        <ToDoCounter/>
        <ToDoSearch/>
        <ToDoList/>
        <CreateToDoButton/>
        {isCreateToDoVisible && <CreateToDo/>}
      </div>
    );
  }
  
  export {AppUI};
  