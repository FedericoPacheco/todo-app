import { AppUI } from './AppUI';
import { ToDoContextProvider } from './ToDoContext';
import { combineReducers, legacy_createStore as createStore } from 'redux';
import { todosReducer } from './redux/todos/reducer';
import { appReducer } from './redux/app/reducer';
import { Provider } from 'react-redux';

const rootReducer = combineReducers({
  todos: todosReducer,
  app: appReducer,
});
const store = createStore(rootReducer);

function App() {

  return (
    <Provider store={store}>
      <ToDoContextProvider>
        <AppUI/>
      </ToDoContextProvider>
    </Provider>
  );
}

export default App;
