import { useContext } from 'react';
import './ToDoCounter.css';
import { ToDoContext } from '../ToDoContext';

function ToDoCounter() {
    const {total, completed} = useContext(ToDoContext);
    
    return (
        <>
            {total === 0 && <h1> <span>ToDo App</span></h1>}
            {total > 0 && <h1> Has completado <span>{completed}</span> de <span>{total}</span> ToDos</h1>}
        </>
    );
}

export {ToDoCounter}