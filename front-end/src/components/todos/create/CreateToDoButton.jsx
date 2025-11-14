import { useContext } from "react";
import "./CreateToDoButton.scss";
import { ToDoContext } from "../ToDoContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function CreateToDoButton() {
  const { setIsModalVisible } = useContext(ToDoContext);

  return (
    <button
      className="add-todo-button"
      onClick={() => setIsModalVisible(true)}
      data-testid="create-todo-button"
    >
      <FontAwesomeIcon icon={faPlus} />
    </button>
  );
}

export { CreateToDoButton };
