
import { AppUI } from './AppUI';
import { ToDoContextProvider } from '../ToDoContext';
import { combineReducers, legacy_createStore as createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { todosReducer } from '../../redux/todos/reducer';
import { appReducer } from '../../redux/app/reducer';
import { Provider } from 'react-redux';
import rootSaga from '../../redux/rootSaga';
import { composeWithDevTools } from '@redux-devtools/extension'; // https://stackoverflow.com/a/78135170/27971560

const rootReducer = combineReducers({
  todos: todosReducer,
  app: appReducer,
});
const sagaMiddleware = createSagaMiddleware();
const composedWithDevTools = composeWithDevTools(applyMiddleware(sagaMiddleware)); 
const store = createStore(
  rootReducer,
  composedWithDevTools
);
sagaMiddleware.run(rootSaga);

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
