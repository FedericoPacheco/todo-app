import './ToDoList.css'

function ToDoList({tab, children}) {
    return (
        <>
            <div className = "tabs">
                <h2 className = {tab === "pending"? "highlighted-tab":""}>Pendientes</h2>
                <h2 className = {tab === "completed"? "highlighted-tab":""}>Completadas</h2>
            </div>
            <ul className = "tasks-box">
                {children}
            </ul>
        </>
    );
}

export {ToDoList};