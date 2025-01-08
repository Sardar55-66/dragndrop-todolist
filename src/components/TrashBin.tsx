import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import trashIconDefault from "../assets/trashbin.png";
import trashIconHovered from "../assets/trashbin-hover.png";
import doneSmile from "../assets/done-smile.png";

interface TrashBinProps {
  handleDeleteAllDoneTasks: () => void;
}

const TrashBin: React.FC<TrashBinProps> = ({ handleDeleteAllDoneTasks }) => {
  const [trashIcon, setTrashIcon] = useState(trashIconDefault)
  return (
    <Droppable droppableId="trash-bin">
      {(provided, snapshot) => (
        <>
          <div className="column-smile-container">
            <img src={doneSmile} alt="done-smile" />Done
          </div>
          <button
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`task-del-btn ${snapshot.isDraggingOver ? setTrashIcon(trashIconHovered) : setTrashIcon(trashIconDefault)}`}
            type="button"
            onClick={handleDeleteAllDoneTasks}
          >
            <img
              src={trashIcon}
              alt="trash"
              onMouseEnter={() => setTrashIcon(trashIconHovered)}
              onMouseLeave={() => setTrashIcon(trashIconDefault)}
            />
            <div className="provided-placeholder">{provided.placeholder}</div>
          </button>
        </>
      )}
    </Droppable>
  );
};


export default TrashBin;
