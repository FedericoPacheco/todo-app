import './AppUI.css';
import { ToDoCounter } from './count/ToDoCounter';
import { ToDoSearch } from './search/ToDoSearch';
import { ToDoList } from './list/ToDoList';
import { ToDoItem } from './list/ToDoItem';
import { CreateToDoButton} from './create/CreateToDoButton';
import { CreateToDo } from './create/CreateToDo';
import { useContext } from 'react';
import { ToDoContext } from './ToDoContext';

function AppUI() {

    const {
      toDos,
      doSearch,
      tab,
      searchValue,
      isCreateToDoVisible,
    } = useContext(ToDoContext);
  
    // Search 
    const preprocessText = rawText => {
      // Remove numbers and special, non printable characters, and spanish characters
      const regex = /[\W\dáéíóúÁÉÍÓÚñÑ\s]/g;
      return rawText.replace(regex, "").toLowerCase();
    }
  
    console.log(toDos);

    return (
      <div className = "App">
        <ToDoCounter/>
        <ToDoSearch/>
        <ToDoList> 
          { toDos
            .filter(todo => todo.state === tab)
            // If the user wants to search specific todos, filter todos; otherwise return the whole array
            .filter(todo => doSearch? preprocessText(todo.text).includes(preprocessText(searchValue)): true)
            .map(todo => 
              <ToDoItem
                key = {todo.id} // Needed by react
                text = {todo.text}
              ></ToDoItem>
            )
          }
        </ToDoList>
        <CreateToDoButton/>
        {isCreateToDoVisible && <CreateToDo/>}
      </div>
    );
  }
  
  export {AppUI};
  