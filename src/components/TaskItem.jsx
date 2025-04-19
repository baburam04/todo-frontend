import { useState } from 'react';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    completed: task.completed
  });

  const handleChange = (e) => {
    setEditedTask({
      ...editedTask,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (e) => {
    setEditedTask({
      ...editedTask,
      completed: e.target.checked
    });
    onUpdate(task._id, { ...editedTask, completed: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(task._id, editedTask);
    setIsEditing(false);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleChange}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div className="task-content">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleCheckboxChange}
            />
            <div>
              <h3>{task.title}</h3>
              {task.description && <p>{task.description}</p>}
            </div>
          </div>
          <div className="task-actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => onDelete(task._id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;