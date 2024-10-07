import './CreateToDo.css';
import { useState } from 'react';

function CreateToDo({seq, setSeq, toDos, setToDos, setIsCreateToDoVisible}) {
    const [description, setDescription] = useState(""); 
    
    return (
        <div className = "create-to-do-box">
            <legend>Descripción 
                <textarea 
                    value = {description}
                    onChange = {(e) => setDescription(e.target.value)}
                ></textarea>
            </legend>
            <button onClick = {() => {
                setToDos([...toDos, {id: seq, text: description, state: "pending"}]);
                setSeq(++seq);
                setIsCreateToDoVisible(false);
            }}>Crear</button>
        </div>
    );
}

export { CreateToDo };