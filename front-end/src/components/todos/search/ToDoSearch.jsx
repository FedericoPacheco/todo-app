import { useContext } from 'react';
import './ToDoSearch.scss';
import { ToDoContext } from '../ToDoContext';

function ToDoSearch() {
    const { setDoSearch, setSearchValue } = useContext(ToDoContext);

    return (
        <div className='search-container'>
            <input 
                onChange = {(e) => {
                    setDoSearch(false);
                    setSearchValue(e.target.value)
                }} 
                placeholder = "Cortar cebolla"
            />
            <button className = "search-button" 
                onClick = {() => setDoSearch(true)}    
            >Buscar</button>
        </div>
    );
}

export {ToDoSearch};