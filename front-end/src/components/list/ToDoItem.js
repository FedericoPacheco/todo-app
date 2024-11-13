import { PENDING, COMPLETED } from '../../redux/todos/constants';
import './ToDoItem.css';
function ToDoItem({text, tab, onStateChange, onDelete}) {                   
    
    return (
        <>
            <li>
                <span
                    onClick = {onStateChange}
                    className = "check"
                >{tab === PENDING? COMPLETED[0].toUpperCase() : PENDING[0].toUpperCase()}</span>
                <p>{text}</p>
                <span
                    onClick = {onDelete}
                    className = "delete"
                >X</span>
            </li>
            <hr></hr>
        </>
    );
}

export {ToDoItem};