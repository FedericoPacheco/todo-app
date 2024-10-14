import './CreateToDoButton.css';

function CreateToDoButton({setIsCreateToDoVisible}) {
    return (
        <button onClick = {() => setIsCreateToDoVisible(true)}>+</button>
    );
}

export { CreateToDoButton };
