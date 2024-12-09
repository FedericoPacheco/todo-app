import { useContext } from 'react';
import './ToDoCounter.scss';
import { ToDoContext } from '../ToDoContext';

function ToDoCounter() {
    const {total, completed} = useContext(ToDoContext);
    
    return (
        <div className = "counter">
            {total === 0 && <h1><span>ToDo App</span></h1>}
            {total > 0 && <h1> Has completado <span>{completed}</span> de <span>{total}</span> ToDos</h1>}
        </div>
    );
}

export {ToDoCounter}