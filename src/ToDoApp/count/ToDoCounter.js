import './ToDoCounter.css';

function ToDoCounter({total, completed}) {
    return (
        <>
            {total === 0 && <h1> <span>ToDo App</span></h1>}
            {total > 0 && <h1> Has completado <span>{completed}</span> de <span>{total}</span> ToDos</h1>}
        </>
    );
}

export {ToDoCounter}