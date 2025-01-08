import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Task {
  id: number;
  type:  'todo' | 'in_progress' | 'review' | 'done';
  startDay: number;
  endDay: number;
  text: string;
}

interface AddTaskModalProps {
  onClose: () => void;
  onAddTask: (task: Task) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onAddTask }) => {
  const [startDay, setStartDay] = useState<Date | null>(null);
  const [endDay, setEndDay] = useState<Date | null>(null);
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (startDay && endDay && text.trim()) {
      const newTask: Task = {
        id: Date.now(), // уникальный id
        type: 'todo', // новая задача по умолчанию в статусе "To Do"
        startDay: startDay.getTime(),
        endDay: endDay.getTime(),
        text,
      };
      onAddTask(newTask);
      onClose();
    } else {
      alert('Пожалуйста, заполните все поля.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Добавить новую задачу</h3>
        <div className="modal-field">
          <label>Дата начала:</label>
          <DatePicker
            selected={startDay}
            onChange={(date) => setStartDay(date)}
            dateFormat="dd.MM.yyyy"
          />
        </div>
        <div className="modal-field">
          <label>Дата окончания:</label>
          <DatePicker
            selected={endDay}
            onChange={(date) => setEndDay(date)}
            dateFormat="dd.MM.yyyy"
          />
        </div>
        <div className="modal-field">
          <label>Описание:</label>
          <input
            type='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="modal-buttons">
          <button onClick={handleAdd}>Добавить</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
