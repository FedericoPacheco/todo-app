
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
import { LOGIN_PATH, LOGOUT_PATH, TODOS_PATH } from './Paths';
import { Login } from './auth/Login';
import { Logout } from './auth/Logout';
import { getSessionStatus } from '../api/api';
import { useEffect } from 'react';
import { AUTH_SUCCESS } from '../redux/app/constants';

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

// TODO: add signup feature
function App() {

  useEffect(() => {
    store.dispatch(getSessionStatus());
  }, []);
  
  return (
    <HashRouter>
      <Provider store={store}>
        <ToDoContextProvider>
          <Routes> 
            { store.getState().app.authStatus === AUTH_SUCCESS ? (
              <>
                <Route path = {TODOS_PATH} element = {<Todos />} />
                <Route path = {LOGOUT_PATH} element = {<Logout />} /> 
                <Route path = "*" element = {<Todos />} /> 
              </>
            ) : (
              <>
                <Route path={LOGIN_PATH} element={<Login />} />
                <Route path = "*" element = {<Login />} />
              </>
            )
            }
          </Routes>
        </ToDoContextProvider>
      </Provider>
    </HashRouter>
  );
}

export default App;
