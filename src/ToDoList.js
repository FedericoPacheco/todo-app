import './ToDoList.css'
import { PENDING_STR } from './App';
import { COMPLETED_STR } from './App';

function ToDoList({tab, setTab, children}) {
    return (
        <>
            <div className = "tabs">
                <h2 
                    onClick = {() => setTab(PENDING_STR)}
                    className = {tab === PENDING_STR? "highlighted-tab":""}
                >Pendientes</h2>
                <h2
                    onClick = {() => setTab(COMPLETED_STR)} 
                    className = {tab === COMPLETED_STR? "highlighted-tab":""}   
                >Completadas</h2>
            </div>
            <ul className = "tasks-box">
                {children}
            </ul>
        </>
    );
}

export {ToDoList};