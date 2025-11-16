import { PENDING } from "../../../redux/todos/constants";
import PropTypes from "prop-types";
import "./ToDoItem.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const MAX_TODO_LENGTH = 64;
export function ToDoItem({ text, tab, onStateChange, onTextChange, onDelete }) {
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const trimmedText =
    text.length > MAX_TODO_LENGTH
      ? `${text.slice(0, MAX_TODO_LENGTH)}...`
      : text;

  // Mobile double tap handler
  const handleTouchStart = () => {
    setTapCount((prev) => prev + 1);
    setTimeout(() => setTapCount(0), 300);
    if (tapCount >= 1) onTextEdit();
  };

  const onTextEdit = () => {
    setIsDoubleClicked(true);
    onTextChange();
    setTimeout(() => setIsDoubleClicked(false), 500);
  };

  return (
    <div className="todo-item-container">
      <li className={isDoubleClicked ? "double-clicked" : ""}>
        <span onClick={onStateChange} className="check">
          {tab === PENDING ? (
            <FontAwesomeIcon icon={faCheck} />
          ) : (
            <FontAwesomeIcon icon={faClock} />
          )}
        </span>
        <p onTouchStart={handleTouchStart} onDoubleClick={onTextEdit}>
          {trimmedText}
        </p>
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
  onTextChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
