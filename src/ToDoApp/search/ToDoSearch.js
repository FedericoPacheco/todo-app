import './ToDoSearch.css';

function ToDoSearch({setDoSearch, setSearchValue}) {
    return (
        <>
            <input 
                onChange = {(e) => {
                    setDoSearch(false);
                    setSearchValue(e.target.value)
                }} 
                placeholder = "Cortar cebolla"
            />
            <button 
                onClick = {() => setDoSearch(true)}    
            >Buscar</button>
        </>
    );
}

export {ToDoSearch};