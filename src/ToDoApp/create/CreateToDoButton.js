import { useContext } from 'react';
import './CreateToDoButton.css';
import { ToDoContext } from '../ToDoContext';

function CreateToDoButton() {
    const { setIsCreateToDoVisible } = useContext(ToDoContext);
    
    return (
        <button className = "add-todo-button" onClick = {() => setIsCreateToDoVisible(true)}>+</button>
    );
}

export { CreateToDoButton };
