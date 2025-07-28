import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Welcome.css';

interface Todo {
  _id: string;
  text: string;
}

const Welcome: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [name, setName] = useState('User');
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || sessionStorage.getItem('temp_token');
  const email = localStorage.getItem('email') || 'xxxxxx@xxxx.com';

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      fetchUserName();
      fetchTodos();
    }
  }, []);

  const fetchUserName = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setName(res.data.name || 'User');
    } catch {
      setName('User');
    }
  };

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    } catch {
      alert('Failed to fetch todos');
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/todos`,
        { text: newTodo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([res.data, ...todos]);
      setNewTodo('');
    } catch {
      alert('Failed to add todo');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter((t) => t._id !== id));
    } catch {
      alert('Failed to delete todo');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div className="dashboard">
      <header className="header">
                  <svg width="47" height="32" viewBox="0 0 47 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.6424 0.843087L24.4853 0L21.8248 9.89565L19.4228 0.961791L16.2656 1.80488L18.8608 11.4573L12.3967 5.01518L10.0855 7.31854L17.1758 14.3848L8.34596 12.0269L7.5 15.1733L17.1477 17.7496C17.0372 17.2748 16.9788 16.7801 16.9788 16.2717C16.9788 12.6737 19.9055 9.75685 23.5159 9.75685C27.1262 9.75685 30.0529 12.6737 30.0529 16.2717C30.0529 16.7768 29.9952 17.2685 29.8861 17.7405L38.6541 20.0818L39.5 16.9354L29.814 14.3489L38.6444 11.9908L37.7984 8.84437L28.1128 11.4308L34.5768 4.98873L32.2656 2.68538L25.2737 9.65357L27.6424 0.843087Z" fill="#367AFF"/>
<path d="M29.8776 17.7771C29.6069 18.9176 29.0354 19.9421 28.2513 20.763L34.6033 27.0935L36.9145 24.7901L29.8776 17.7771Z" fill="#367AFF"/>
<path d="M28.1872 20.8292C27.3936 21.637 26.3907 22.2398 25.2661 22.5504L27.5775 31.1472L30.7346 30.3041L28.1872 20.8292Z" fill="#367AFF"/>
<path d="M25.1482 22.5818C24.6264 22.7155 24.0795 22.7866 23.5159 22.7866C22.9121 22.7866 22.3274 22.705 21.7723 22.5522L19.4589 31.1569L22.616 31.9999L25.1482 22.5818Z" fill="#367AFF"/>
<path d="M21.6607 22.5206C20.5532 22.1945 19.5682 21.584 18.7908 20.7739L12.4232 27.1199L14.7344 29.4233L21.6607 22.5206Z" fill="#367AFF"/>
<path d="M18.7377 20.7178C17.9737 19.9026 17.4172 18.8917 17.1523 17.7688L8.35571 20.1178L9.20167 23.2642L18.7377 20.7178Z" fill="#367AFF"/>
</svg>
        <div className="left">
          <h2> Dashboard</h2>
        </div>
        <div className="right">
          <button onClick={handleLogout} className="logout-btn">Sign Out</button>
        </div>
      </header>

      <div className="card">
        <h3>Welcome, {name} .!</h3>
        <p>Email: {email}</p>
      </div>

      <div className="todo-input">
        <input
          type="text"
          placeholder="Create a note"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <div className="todo-list">
        {todos.map((todo) => (
          <div key={todo._id} className="todo-item">
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo._id)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.30775 20.5C6.81058 20.5 6.385 20.323 6.031 19.969C5.677 19.615 5.5 19.1894 5.5 18.6922V5.99998H5.25C5.0375 5.99998 4.85942 5.92806 4.71575 5.78423C4.57192 5.6404 4.5 5.46223 4.5 5.24973C4.5 5.03706 4.57192 4.85898 4.71575 4.71548C4.85942 4.57181 5.0375 4.49998 5.25 4.49998H9C9 4.25515 9.08625 4.04648 9.25875 3.87398C9.43108 3.70165 9.63967 3.61548 9.8845 3.61548H14.1155C14.3603 3.61548 14.5689 3.70165 14.7413 3.87398C14.9138 4.04648 15 4.25515 15 4.49998H18.75C18.9625 4.49998 19.1406 4.5719 19.2843 4.71573C19.4281 4.85956 19.5 5.03773 19.5 5.25023C19.5 5.4629 19.4281 5.64098 19.2843 5.78448C19.1406 5.92815 18.9625 5.99998 18.75 5.99998H18.5V18.6922C18.5 19.1894 18.323 19.615 17.969 19.969C17.615 20.323 17.1894 20.5 16.6923 20.5H7.30775ZM17 5.99998H7V18.6922C7 18.7821 7.02883 18.8558 7.0865 18.9135C7.14417 18.9711 7.21792 19 7.30775 19H16.6923C16.7821 19 16.8558 18.9711 16.9135 18.9135C16.9712 18.8558 17 18.7821 17 18.6922V5.99998ZM10.1543 17C10.3668 17 10.5448 16.9281 10.6885 16.7845C10.832 16.6406 10.9037 16.4625 10.9037 16.25V8.74998C10.9037 8.53748 10.8318 8.35931 10.688 8.21548C10.5443 8.07181 10.3662 7.99998 10.1535 7.99998C9.941 7.99998 9.76292 8.07181 9.61925 8.21548C9.47575 8.35931 9.404 8.53748 9.404 8.74998V16.25C9.404 16.4625 9.47583 16.6406 9.6195 16.7845C9.76333 16.9281 9.94158 17 10.1543 17ZM13.8465 17C14.059 17 14.2371 16.9281 14.3807 16.7845C14.5243 16.6406 14.596 16.4625 14.596 16.25V8.74998C14.596 8.53748 14.5242 8.35931 14.3805 8.21548C14.2367 8.07181 14.0584 7.99998 13.8458 7.99998C13.6333 7.99998 13.4552 8.07181 13.3115 8.21548C13.168 8.35931 13.0962 8.53748 13.0962 8.74998V16.25C13.0962 16.4625 13.1682 16.6406 13.312 16.7845C13.4557 16.9281 13.6338 17 13.8465 17Z" fill="#050400"/>
</svg>
</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Welcome;
