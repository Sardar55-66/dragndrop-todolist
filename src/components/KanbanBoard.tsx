import React, { useState, useEffect } from 'react';
import { groupTasksByType, isOverdue, Task, TaskType, validTaskTypes } from '../utils/taskUtils';
import todoSmile from '../assets/todo-smile.png';
import inProgressSmile from '../assets/inprogress-smile.png';
import reviewSmile from '../assets/review-smile.png';
import editBtnIcon from '../assets/editbtn.png';
import hoveredEditBtn from '../assets/editbtn-hovered.png';
import editBtnCancel from '../assets/editbtn-cancel.png';
import editBtnOk from '../assets/editbtn-ok.png';
import editBtnOkHovered from '../assets/editbtn-ok-hovered.png';
import editBtnCancelHovered from '../assets/editbtn-cancel-hovered.png'
import AddTaskModal from './AddTaskModal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DatePicker from 'react-datepicker';
import TrashBin from './TrashBin';
import tasksJson from '../utils/tasks.json';

interface KanbanBoardProps {
  searchQuery: string;
}
const KanbanBoard: React.FC<KanbanBoardProps> = ({ searchQuery })  => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [temporaryEditingTask, setTemporaryEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editIcon, setEditIcon] = useState(editBtnIcon);
  const [saveBtnIcon, setSaveBtnIcon] = useState(editBtnOk);
  const [cancelBtnIcon, setCancelBtnIcon] = useState(editBtnCancel);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState({
    todo: [] as Task[],
    in_progress: [] as Task[],
    review: [] as Task[],
    done: [] as Task[],
  });

  useEffect(() => {
    filterTasks(searchQuery);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, tasks]);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
  
    if (storedTasks) {
      // Если есть задачи в localStorage, загружаем их
      const savedTasks: Task[] = JSON.parse(storedTasks);
      setTasks(savedTasks);
      setFilteredTasks(savedTasks);
      setColumns(groupTasksByType(savedTasks));
    } else {
      // Если задач в localStorage нет, загружаем из файла tasks.json
      const data: Task[] = tasksJson
  .filter((task) => validTaskTypes.includes(task.type as TaskType))
        .map((task) => ({
          ...task,
          type: task.type as TaskType,
        })); 
      setTasks(data);
      setFilteredTasks(data);
      setColumns(groupTasksByType(data));
      localStorage.setItem('tasks', JSON.stringify(data)); // Сохраняем начальные задачи в localStorage
    }
  }, []);
  

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

   const filterTasks = (query: string) => {
    if (!query) {
      setFilteredTasks(tasks); // Если нет запроса, показываем все задачи
      setErrorMessage("");
      return;
    }

    const filtered = tasks.filter((task) => {
     
      const taskText = task.text.toLowerCase();
      const queryLower = query.toLowerCase();

      const isDate = /^\d{2}\.\d{2}\.\d{4}$/.test(query);
      if (isDate) {
        const [day, month, year] = query.split('.').map(Number);
        const formattedDate = new Date(year, month - 1, day).getTime();

        return (
          task.startDay === formattedDate ||
          task.endDay === formattedDate
        );
      }
     
      return taskText.includes(queryLower);
    });

    if (filtered.length === 0) {
      setErrorMessage("Нет подходящих задач.");
    } else {
      setErrorMessage("");
    }

    setFilteredTasks(filtered);
  };

  useEffect(() => {
    setColumns(groupTasksByType(filteredTasks));
  }, [filteredTasks]);
  

  const startEditingTask = (task: Task) => {
    if (task.type !== 'todo') return; 
    setEditingTask(task);
    setTemporaryEditingTask({ ...task });
  };

  const saveTaskEdits = () => {
    if (editingTask && temporaryEditingTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id ? { ...temporaryEditingTask } : task
      );

      const sanitizedTasks = updatedTasks.filter((task) =>
        validTaskTypes.includes(task.type as TaskType)
      ).map((task) => ({
        ...task,
        type: task.type as TaskType, // Приведение к TaskType
      }));

      setTasks(updatedTasks);
      setColumns(groupTasksByType(sanitizedTasks));
      setEditingTask(null);
      setTemporaryEditingTask(null);
    }
  };

  const cancelEditingTask = () => {
    setEditingTask(null);
    setTemporaryEditingTask(null);
  };

  const handleDeleteAllDoneTasks = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.type !== 'done'));
    setColumns((prevColumns) => ({
      ...prevColumns,
      done: [],
    }));
  };

  const handleAddTask = (newTask: Task) => {
    const updatedTasks = [...tasks, newTask]; // Добавляем новую задачу в массив
    setTasks(updatedTasks); // Обновляем состояние
    setFilteredTasks(updatedTasks); // Обновляем отфильтрованные задачи
    setColumns(groupTasksByType(updatedTasks)); // Перегруппировываем задачи по типу
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Сохраняем обновленный массив в localStorage
  };

  return (
    <DragDropContext
        onDragEnd={(result) => {
          const { destination, source, draggableId } = result;

          if (!destination) return;

          if (source.droppableId === destination.droppableId) return;

          if (destination.droppableId === "trash-bin") {
            setTasks((prevTasks) => prevTasks.filter((task) => task.id.toString() !== draggableId));
            setColumns(groupTasksByType(tasks)); 
            return;
          }

          const taskToMove = tasks.find((task) => task.id.toString() === draggableId);
          if (!taskToMove) return;

          const updatedTask = { ...taskToMove, type: destination.droppableId };
          const updatedTasks = tasks.map((task) =>
            task.id === taskToMove.id ? updatedTask : task
          );
          setTasks(updatedTasks);
          setColumns(groupTasksByType(updatedTasks));
        }}
      >

      <div className="kanban-board">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
        {['todo', 'in_progress', 'review', 'done'].map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="column">
                <h3 className='first-columns-container'>
                  {status === 'todo' && (
                    <>
                      <div className="column-smile-container">
                        <img src={todoSmile} alt="todo-smile" /> To Do{' '}
                      </div>
                      <button
                        className="task-add-btn"
                        type="button"
                        onClick={() => setModalOpen(true)}
                      >
                        + Добавить
                      </button>
                    </>
                  )}
                  {/* Отображение других колонок без кнопки добавления */}
                  {status === 'in_progress' && (
                    <div className="column-smile-container">
                      <img src={inProgressSmile} alt="in-progress-smile" /> In Progress
                    </div>
                  )}
                  {status === 'review' && (
                    <div className="column-smile-container">
                      <img src={reviewSmile} alt="review-smile" /> Review
                    </div>
                  )}
                  {status === 'done' && (
                   <TrashBin handleDeleteAllDoneTasks={handleDeleteAllDoneTasks}/>
                  )}
                </h3>
                {columns[status as "todo" | "in_progress" | "review" | "done"].map((task: Task, index: number) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={editingTask?.id === task.id ? 'task-card editing' : ((isOverdue(task.endDay) && task.type !== 'done') ? 'task-card overdue' : 'task-card')}
                      >
                        {editingTask?.id === task.id ? (
                          <div className="task-edit-form">
                            <label className="tasks-edit-descr">
                              Начало:
                              <DatePicker
                                className="tasks-edit-descr-value"
                                selected={temporaryEditingTask?.startDay ? new Date(temporaryEditingTask.startDay) : null}
                                onChange={(date) =>
                                  setTemporaryEditingTask((prev: Task | null) =>
                                    prev ? { 
                                      ...prev, 
                                      startDay: date ? date.getTime() : null 
                                    } : null
                                  )
                                }
                                dateFormat="dd.MM.yyyy"
                              />
                            </label>
                            <label className="tasks-edit-descr">
                              Окончание:
                              <DatePicker
                                className="tasks-edit-descr-value"
                                selected={temporaryEditingTask?.endDay ? new Date(temporaryEditingTask.endDay) : null}
                                onChange={(date) =>
                                  setTemporaryEditingTask((prev: Task | null) =>
                                    prev ? { 
                                      ...prev, 
                                      endDay: date ? date.getTime() : null 
                                    } : null
                                  )
                                }
                                dateFormat="dd.MM.yyyy"
                              />
                            </label>
                            <label className="tasks-edit-descr">
                              Описание:
                              <input
                                className="tasks-edit-descr-value"
                                type="text"
                                value={temporaryEditingTask?.text || ''}
                                onChange={(e) =>
                                  setTemporaryEditingTask((prev: Task | null) =>
                                    prev ? { ...prev, text: e.target.value } : null
                                  )
                                }
                              />
                            </label>
                            <div className="edit-btn-group">
                            <button type='button' className="task-cancel-btn" onClick={cancelEditingTask}>
                                <img 
                                src={cancelBtnIcon} 
                                alt="edit-cancel" 
                                onMouseEnter={() => setCancelBtnIcon(editBtnCancelHovered)}
                                onMouseLeave={() => setCancelBtnIcon(editBtnCancel)}
                                />
                              </button>
                              <button type='button' className="task-save-btn" onClick={saveTaskEdits}>
                                <img 
                                src={saveBtnIcon} 
                                alt="edit-ok" 
                                onMouseEnter={() => setSaveBtnIcon(editBtnOkHovered)}
                                onMouseLeave={() => setSaveBtnIcon(editBtnOk)}
                                />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                          <p className="tasks-descr">
                            Начало: <span>{task.startDay ? new Date(task.startDay).toLocaleDateString('ru-RU').replace(/\//g, '.') : 'Не установлено'}</span>
                          </p>
                          <p className="tasks-descr">
                            Окончание:{' '}
                            <span>{task.endDay ? new Date(task.endDay).toLocaleDateString('ru-RU').replace(/\//g, '.') : 'Не установлено'}</span>
                          </p>
                          <p className="tasks-descr">Описание: <span>{task.text}</span></p>
                          {status === 'todo' && (
                            <button
                              type="button"
                              className="tasks-edit-btn"
                              onClick={() => startEditingTask(task)}
                            >
                              <img
                                src={editIcon}
                                alt="edit-btn"
                                onMouseEnter={() => setEditIcon(hoveredEditBtn)}
                                onMouseLeave={() => setEditIcon(editBtnIcon)}
                              />
                            </button>
                          )}
                        </>
                        
                      )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
      {isModalOpen && (
        <AddTaskModal
          onClose={() => setModalOpen(false)}
          onAddTask={handleAddTask}
        />
      )}
    </DragDropContext>
  );
};

export default KanbanBoard;
