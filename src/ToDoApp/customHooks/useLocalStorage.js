import { useState , useEffect } from 'react';

const TEST_TIMEOUT = 2000;

function useLocalStorage(itemKey, initialValue) {

    const [item, setItem] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
  
    const saveItem = (newItem) => {
      setItem(newItem);
      localStorage.setItem(itemKey, JSON.stringify(newItem));
    };
  
    useEffect(() => {
      setTimeout(() => {
        try {
          const storedItem = localStorage.getItem(itemKey);
          const parsedItem = storedItem? JSON.parse(storedItem) : initialValue;
          setItem(parsedItem);
          setLoading(false);
        } catch (e) {
          setLoading(false);
          setError(true);
          console.log(e);
        }
      }, TEST_TIMEOUT)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    return {item, saveItem, loading, error};
  }
  
  export { useLocalStorage };