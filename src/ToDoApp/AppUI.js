import './AppUI.css';
import { ToDoCounter } from './count/ToDoCounter';
import { ToDoSearch } from './search/ToDoSearch';
import { ToDoList } from './list/ToDoList';
import { CreateToDoButton} from './create/CreateToDoButton';
import { CreateToDo } from './create/CreateToDo';
import { useContext } from 'react';
import { ToDoContext } from './ToDoContext';

function AppUI() {

    const { toDos, isCreateToDoVisible } = useContext(ToDoContext);
  
    console.log("toDos:", toDos);
    console.log("isCreateToDoVisible:", isCreateToDoVisible);

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
  