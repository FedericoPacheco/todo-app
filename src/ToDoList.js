import './ToDoList.css'
import { PENDING } from './App';
import { COMPLETED } from './App';

function ToDoList({tab, setTab, children}) {
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
            <ul className = "tasks-box">
                {children}
            </ul>
        </>
    );
}

export {ToDoList};