import { useContext } from 'react';
import { COMPLETED, PENDING } from '../ToDoContext';
import './ToDoItem.css';
import { ToDoContext } from '../ToDoContext';

function ToDoItem({text}) {                    
    const { tab, onStateChange, onDelete } = useContext(ToDoContext);
    
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