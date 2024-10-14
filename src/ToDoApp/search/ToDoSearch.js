import { useContext } from 'react';
import './ToDoSearch.css';
import { ToDoContext } from '../ToDoContext';

function ToDoSearch() {
    const { setDoSearch, setSearchValue } = useContext(ToDoContext);
    
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