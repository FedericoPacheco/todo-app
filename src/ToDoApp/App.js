import { AppUI } from './AppUI';
import { ToDoContextProvider } from './ToDoContext';

function App() {

  return (
    <ToDoContextProvider>
      <AppUI/>
    </ToDoContextProvider>
  );
}

export default App;
