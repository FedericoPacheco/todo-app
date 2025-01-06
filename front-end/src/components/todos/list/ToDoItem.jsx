import { PENDING } from "../../../redux/todos/constants";
import PropTypes from "prop-types";
import "./ToDoItem.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock, faXmark } from "@fortawesome/free-solid-svg-icons";

export function ToDoItem({ text, tab, onStateChange, onDelete }) {
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

ToDoItem.propTypes = {
  text: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
  onStateChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
