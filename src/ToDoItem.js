import './ToDoItem.css';

function ToDoItem({text, state}) {
    return (
        <>
            <li>
                <span className = "check">V</span>
                <p>{text}</p>
                <span className = "delete">X</span>
            </li>
            <hr></hr>
        </>
    );
}

export {ToDoItem};