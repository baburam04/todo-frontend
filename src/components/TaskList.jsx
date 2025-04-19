import TaskItem from './TaskItem';

const TaskList = ({ tasks, onUpdate, onDelete }) => {
  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <p>No tasks found. Add one to get started!</p>
      ) : (
        tasks.map(task => (
          <TaskItem
            key={task._id}
            task={task}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;