import { useEffect, createContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllTodos,
  changeStateTodo,
  changeTextTodo,
  addTodo,
  deleteTodo,
} from "../../redux/todos/actionFunctions";
import { PENDING, COMPLETED } from "../../redux/todos/constants";

export const ToDoContext = createContext();

const DEFAULT_TAB = PENDING;

// eslint-disable-next-line react/prop-types
export function ToDoContextProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllTodos());
  }, []);

  // Todos state
  const toDos = Object.values(useSelector((state) => state.todos.list));

  const [tab, setTab] = useState(DEFAULT_TAB);

  const [searchValue, setSearchValue] = useState("");
  const [doSearch, setDoSearch] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedTodo, setEditedTodo] = useState(null);

  // Counters
  const pending = toDos.filter((todo) => todo.state === PENDING).length;
  const completed = toDos.filter((todo) => todo.state === COMPLETED).length;
  const total = toDos.length;

  // Actions
  const onStateChange = (id) => {
    const newToDoState = tab === PENDING ? COMPLETED : PENDING;
    dispatch(changeStateTodo(id, newToDoState));
  };

  const onDelete = (id) => {
    dispatch(deleteTodo(id));
  };

  const onCreate = (description) => {
    dispatch(
      addTodo({
        text: description,
        state: tab,
      }),
    );
    setIsModalVisible(false);
  };

  const onEdit = (id, description) => {
    dispatch(changeTextTodo(id, description));
    setIsModalVisible(false);
    setEditedTodo(null);
  };

  return (
    <ToDoContext.Provider
      value={{
        tab,
        setTab,
        searchValue,
        setSearchValue,
        doSearch,
        setDoSearch,
        isModalVisible,
        setIsModalVisible,
        editedTodo,
        setEditedTodo,
        pending,
        completed,
        total,
        onStateChange,
        onDelete,
        onCreate,
        onEdit,
      }}
    >
      {children}
    </ToDoContext.Provider>
  );
}
