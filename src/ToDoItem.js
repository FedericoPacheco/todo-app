import './ToDoItem.css';

function ToDoItem({id, text, toDos, setToDos}) {
    return (
        <>
            <li>
                <span onClick = {() => { 
                    const auxToDos = [...toDos]
                    auxToDos.find(todo => todo.id === id).state = "completed";
                    setToDos(auxToDos);
                }}
                className = "check">V</span>
                <p>{text}</p>
                <span onClick = {() => {
                    setToDos(toDos.filter(todo => todo.id !== id));
                }} 
                className = "delete">X</span>
            </li>
            <hr></hr>
        </>
    );
}

export {ToDoItem};