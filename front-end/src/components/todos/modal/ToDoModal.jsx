import { ToDoContext } from "../ToDoContext";
import "./ToDoModal.scss";
import { useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";

function ToDoModal() {
  const { onCreate, onEdit, onCancel, editedTodo, isEditingModal } =
    useContext(ToDoContext);

  const [newDescription, setDescription] = useState(
    isEditingModal ? editedTodo.text : "",
  );
  const isValidInput = isEditingModal
    ? editedTodo.text !== newDescription && newDescription.length > 0
    : newDescription.length > 0;

  // Animations
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    // Trigger after mount
    setIsOpen(true);
  }, []);

  const handleCancel = () => {
    setIsClosing(true);
    setIsOpen(false);
    setTimeout(() => {
      onCancel();
    }, 250); // Match the transition duration from styles
  };

  return createPortal(
    <div
      className={`modal-container ${isOpen ? "open" : ""} ${isClosing ? "closing" : ""}`}
    >
      <div className="modal">
        <legend>
          Descripción
          <textarea
            value={newDescription}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </legend>
        <div className="modal-button-container">
          {isEditingModal ? (
            <button
              disabled={!isValidInput}
              onClick={() => onEdit(editedTodo.id, newDescription)}
            >
              Editar
            </button>
          ) : (
            <button
              disabled={!isValidInput}
              onClick={() => onCreate(newDescription)}
            >
              Crear
            </button>
          )}
          <button onClick={handleCancel}>Cancelar</button>
        </div>
      </div>
    </div>,
    document.getElementById("modal"),
  );
}

export { ToDoModal };
