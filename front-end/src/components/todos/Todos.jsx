import "./Todos.scss";
import { ToDoCounter } from "./count/ToDoCounter";
import { ToDoSearch } from "./search/ToDoSearch";
import { ToDoList } from "./list/ToDoList";
import { CreateToDoButton } from "./create/CreateToDoButton";
import { CreateToDo } from "./create/CreateToDo";
import { useContext } from "react";
import { ToDoContext } from "./ToDoContext";
import { useSelector } from "react-redux";
import { Logout } from "../auth/logout/Logout";

export function Todos() {
  const { isModalVisible } = useContext(ToDoContext);
  const todos = useSelector((state) => state.todos.list);

  console.table(
    Object.values(todos).map((todo) => ({
      id: todo.id,
      text: todo.text,
      state: todo.state,
    })),
  );
  /* console.group("ToDos");
  Object.values(todos).forEach(todo => console.debug(`id: ${todo.id}, text: ${todo.text}, state: ${todo.state}`));
  console.groupEnd("ToDos"); */

  return (
    <div className="todos-container">
      <ToDoCounter />
      <ToDoSearch />
      <ToDoList />
      <CreateToDoButton />
      <Logout />
      {isModalVisible && <CreateToDo />}
    </div>
  );
}
