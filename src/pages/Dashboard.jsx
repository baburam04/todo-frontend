import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  // Verify authentication and fetch user data
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check if we have a token
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        // Verify token and get user data
        const { data } = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(data.user);
        setAuthChecked(true);
        
        // Now fetch tasks
        await fetchTasks();
      } catch (err) {
        console.error('Authentication check failed:', err);
        localStorage.removeItem('token');
        navigate('/auth');
      }
    };

    verifyAuth();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('/api/tasks');
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      if (err.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task) => {
    try {
      const { data } = await axios.post('/api/tasks', task);
      setTasks([...tasks, data]);
    } catch (err) {
      console.error('Failed to add task:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/auth');
      }
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const { data } = await axios.put(`/api/tasks/${id}`, updatedTask);
      setTasks(tasks.map(task => task._id === id ? data : task));
    } catch (err) {
      console.error('Failed to update task:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/auth');
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/auth');
      }
    }
  };

  // Show loading state until auth check completes
  if (!authChecked) {
    return <div className="loading">Checking authentication...</div>;
  }

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