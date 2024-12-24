import { ToDoContext } from "../ToDoContext";
import "./CreateToDo.scss";
import { useContext, useState } from "react";
import { createPortal } from "react-dom";

function CreateToDo() {
  const [description, setDescription] = useState("");
  const { setIsCreateToDoVisible, onCreate } = useContext(ToDoContext);

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
          <button onClick={() => setIsCreateToDoVisible(false)}>
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal"),
  );
}

export { CreateToDo };
