import { useContext } from "react";
import "./CreateToDoButton.scss";
import { ToDoContext } from "../ToDoContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function CreateToDoButton() {
  const { setIsCreateToDoVisible } = useContext(ToDoContext);

  return (
    <button
      className="add-todo-button"
      onClick={() => setIsCreateToDoVisible(true)}
    >
      <FontAwesomeIcon icon={faPlus} />
    </button>
  );
}

export { CreateToDoButton };
