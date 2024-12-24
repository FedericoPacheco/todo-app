import { PENDING, COMPLETED } from "../../../redux/todos/constants";
import "./ToDoItem.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock, faXmark } from "@fortawesome/free-solid-svg-icons";

function ToDoItem({ text, tab, onStateChange, onDelete }) {
  return (
    <div className="todo-item-container">
      <li>
        <span onClick={onStateChange} className="check">
          {tab === PENDING ? (
            <FontAwesomeIcon icon={faCheck} />
          ) : (
            <FontAwesomeIcon icon={faClock} />
          )}
        </span>
        <p>{text}</p>
        <span onClick={onDelete} className="delete">
          <FontAwesomeIcon icon={faXmark} />
        </span>
      </li>
    </div>
  );
}

export { ToDoItem };
