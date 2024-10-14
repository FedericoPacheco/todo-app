import './ToDoList.css'
import { PENDING, COMPLETED } from '../App';

function ToDoList({tab, setTab, loading, error, pending, completed, children}) {
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
                {children}
            </ul>
        </>
    );
}

export {ToDoList};