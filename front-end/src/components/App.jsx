
import { Todos } from './todos/Todos';
import { ToDoContextProvider } from './todos/ToDoContext';
import { combineReducers, legacy_createStore as createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { todosReducer } from '../redux/todos/reducer';
import { appReducer } from '../redux/app/reducer';
import { Provider } from 'react-redux';
import rootSaga from '../redux/rootSaga';
import { composeWithDevTools } from '@redux-devtools/extension'; // https://stackoverflow.com/a/78135170/27971560
import { HashRouter, Route, Routes } from 'react-router-dom';
import { LOGIN_PATH, TODOS_PATH } from './Paths';
import { Login } from './auth/login/Login';
import { AuthOnly } from './auth/AuthContext';

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
      <HashRouter>
          <Routes>
            <Route path = {LOGIN_PATH} element = {<Login />} />
            <Route path = {TODOS_PATH} element = {
              <AuthOnly>
                <ToDoContextProvider>
                  <Todos/>
                </ToDoContextProvider>
              </AuthOnly>
            } /> 
            <Route path = "*" element = {<Login />} />
          </Routes>
      </HashRouter>
    </Provider>
  );
}

export default App;
