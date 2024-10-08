import './CreateToDo.css';
import { useState } from 'react';

function CreateToDo({onCreate}) {
    const [description, setDescription] = useState(""); 
    
    return (
        <div className = "create-to-do-box">
            <legend>Descripción 
                <textarea 
                    value = {description}
                    onChange = {(e) => setDescription(e.target.value)}
                ></textarea>
            </legend>
            <button onClick = {() => onCreate(description)}
            >Crear</button>
        </div>
    );
}

export { CreateToDo };