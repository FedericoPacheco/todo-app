import { COMPLETED_STR, PENDING_STR } from './App';
import './ToDoItem.css';

function ToDoItem({text, tab, onStateChange, onDelete}) {                    
    return (
        <>
            <li>
                <span
                    onClick = {onStateChange}
                    className = "check"
                >{tab === PENDING_STR? COMPLETED_STR[0].toUpperCase() : PENDING_STR[0].toUpperCase()}</span>
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