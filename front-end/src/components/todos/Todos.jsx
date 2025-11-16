import "./Todos.scss";
import { ToDoCounter } from "./count/ToDoCounter";
import { ToDoSearch } from "./search/ToDoSearch";
import { ToDoList } from "./list/ToDoList";
import { CreateToDoButton } from "./create/CreateToDoButton";
import { ToDoModal } from "./modal/ToDoModal";
import { useContext } from "react";
import { ToDoContext } from "./ToDoContext";
import { Logout } from "../auth/logout/Logout";

export function Todos() {
  const { isModalVisible } = useContext(ToDoContext);

  return (
    <div className="todos-container">
      <ToDoCounter />
      <ToDoSearch />
      <ToDoList />
      <CreateToDoButton />
      <Logout />
      {isModalVisible && <ToDoModal />}
    </div>
  );
}
