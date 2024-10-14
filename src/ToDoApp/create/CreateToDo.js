import { ToDoContext } from '../ToDoContext';
import './CreateToDo.css';
import { useContext, useState } from 'react';

function CreateToDo() {
    const [description, setDescription] = useState(""); 
    const { onCreate } = useContext(ToDoContext);
    
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