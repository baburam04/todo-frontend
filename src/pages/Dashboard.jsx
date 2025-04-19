import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';

const Dashboard = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks');
        setTasks(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (task) => {
    try {
      const res = await axios.post('/api/tasks', task);
      setTasks([...tasks, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const res = await axios.put(`/api/tasks/${id}`, updatedTask);
      setTasks(tasks.map(task => task._id === id ? res.data : task));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}</h1>
      <TaskForm onAdd={addTask} />
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskList 
          tasks={tasks} 
          onUpdate={updateTask} 
          onDelete={deleteTask} 
        />
      )}
    </div>
  );
};

export default Dashboard;