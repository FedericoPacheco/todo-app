import './ToDoList.css'
import { COMPLETED, PENDING } from '../ToDoContext';
import { useContext } from 'react';
import { ToDoContext } from '../ToDoContext';
import { ToDoItem } from './ToDoItem';

function ToDoList({children}) {
    const { 
        toDos, 
        doSearch,
        searchValue, 
        tab, 
        setTab, 
        loading, 
        error, 
        pending, 
        completed,
        onDelete,
        onStateChange
    } = useContext(ToDoContext);
    
    // Search 
    const preprocessText = rawText => {
        // Remove numbers and special, non printable characters, and spanish characters
        const regex = /[\W\dáéíóúÁÉÍÓÚñÑ\s]/g;
        return rawText.replace(regex, "").toLowerCase();
      }

    return (
        <>
            <div className = "tabs">
                <h2 
                    onClick = {() => setTab(PENDING)}
                    className = {tab === PENDING? "highlighted-tab":""}
                >Pendientes</h2>
                <h2
                    onClick = {() => setTab(COMPLETED)} 
                    className = {tab === COMPLETED? "highlighted-tab":""}   
                >Completadas</h2>
            </div>
            <ul className = "todos-box">
                {!error && loading && <li><p>Cargando...</p></li>}
                {error && <li><p>Hubo un error :(</p></li>}
                {(!loading && !error && pending === 0 && tab === PENDING) && <li><p>¡Crea un ToDo!</p></li>}
                {(!loading && !error && completed === 0 && tab === COMPLETED) && <li><p>¡Completa tu primer ToDo!</p></li>}
                { toDos
                    .filter(todo => todo.state === tab)
                    // If the user wants to search specific todos, filter todos; otherwise return the whole array
                    .filter(todo => doSearch? preprocessText(todo.text).includes(preprocessText(searchValue)): true)
                    .map(todo => 
                        <ToDoItem
                            key = {todo.id} // Needed by react
                            text = {todo.text}
                            onDelete = {() => onDelete(todo.id)}
                            onStateChange = {() => onStateChange(todo.id)}
                        ></ToDoItem>
                    )
                }
            </ul>
        </>
    );
}

export {ToDoList};