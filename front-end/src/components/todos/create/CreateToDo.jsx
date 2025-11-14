import { ToDoContext } from "../ToDoContext";
import "./CreateToDo.scss";
import { useContext, useState } from "react";
import { createPortal } from "react-dom";

function CreateToDo() {
  const { setIsModalVisible, onCreate, onEdit, editedTodo, setEditedTodo } =
    useContext(ToDoContext);

  const isEditingModal = !!editedTodo?.id;
  const [description, setDescription] = useState(
    isEditingModal ? editedTodo.text : "",
  );

  const editButton = (
    <button
      onClick={() => {
        if (description.length > 0) {
          onEdit(editedTodo.id, description);
          setDescription("");
        }
      }}
    >
      Editar
    </button>
  );
  const createButton = (
    <button
      onClick={() => {
        if (description.length > 0) {
          onCreate(description);
          setDescription("");
        }
      }}
    >
      Crear
    </button>
  );
  return createPortal(
    <div className="create-container">
      <div className="modal">
        <legend>
          Descripción
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </legend>
        <div className="modal-button-container">
          {isEditingModal ? editButton : createButton}
          <button
            onClick={() => {
              setIsModalVisible(false);
              setEditedTodo(null);
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal"),
  );
}

export { CreateToDo };
