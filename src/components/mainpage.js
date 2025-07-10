import React, { useState, useEffect } from 'react';

function Mainpage({ apiUrl }) {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('Not Start');
  const [showInput, setShowInput] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [theme, setTheme] = useState('light');
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const isDark = theme === 'dark';
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  // 🔄 Fetch Todos from MongoDB on load
  useEffect(() => {
    fetch(`${API_URL}/todos`)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error('Fetch todos error:', err));
  }, [API_URL]);

  // ➕ Add or ✏️ Update Task
  const handleAddOrUpdate = () => {
    if (!input.trim() || !endDate || !status) return;

    if (editTodo) {
      // Update existing
      fetch(`${API_URL}/todos/${editTodo._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, endDate, status }),
      })
        .then((res) => res.json())
        .then((updated) => {
          setTodos((prev) => prev.map((todo) => (todo._id === updated._id ? updated : todo)));
          resetForm();
        });
    } else {
      // Add new
      const startDate = new Date().toLocaleString();
      fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, endDate, status, startDate }),
      })
        .then((res) => res.json())
        .then((newTodo) => {
          setTodos((prev) => [...prev, newTodo]);
          resetForm();
        });
    }
  };

  // 🗑️ Delete
  const handleDelete = (id) => {
    fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' })
      .then(() => {
        setTodos((prev) => prev.filter((todo) => todo._id !== id));
      });
  };

  // ✏️ Edit
  const handleEdit = (todo) => {
    setInput(todo.text);
    setEndDate(todo.endDate);
    setStatus(todo.status);
    setEditTodo(todo);
    setShowInput(true);
  };

  const resetForm = () => {
    setInput('');
    setEndDate('');
    setStatus('Not Start');
    setShowInput(false);
    setEditTodo(null);
  };

  const filteredTodos =
    filterStatus === 'All' ? todos : todos.filter((todo) => todo.status === filterStatus);

  // 🖌️ Styling
  const thStyle = { padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' };
  const tdStyle = { padding: '10px', border: '1px solid #dee2e6' };
  const inputStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };
  const actionBtn = (bg, color) => ({
    padding: '6px 12px',
    borderRadius: '4px',
    backgroundColor: bg,
    color: color,
    border: 'none',
    cursor: 'pointer',
  });
  const sidebarBtn = {
    backgroundColor: '#495057',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'left',
    cursor: 'pointer',
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: isDark ? '#121212' : '#ff6569',
        color: isDark ? '#e9ecef' : '#212529',
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: '200px',
          backgroundColor: isDark ? '#1f1f1f' : 'black',
          color: '#ff6569',
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
        }}
      >
        <h2 style={{ fontSize: '40px', borderBottom: '1px solid #555' }}>To-Do</h2>
        <button style={sidebarBtn}>🏠 Home</button>
        <button style={sidebarBtn} onClick={() => setShowSettings((prev) => !prev)}>
          ⚙️ Settings
        </button>
        <button style={sidebarBtn} onClick={() => setShowAbout((prev) => !prev)}>
          ℹ️ About
        </button>

        {showSettings && (
          <div>
            <p>Theme:</p>
            <button style={actionBtn('#f8f9fa', '#212529')} onClick={() => setTheme('light')}>
              🌞 Light
            </button>
            <button
              style={{ ...actionBtn('#212529', '#fff'), marginTop: '10px' }}
              onClick={() => setTheme('dark')}
            >
              🌙 Dark
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: isDark ? '#282c34' : '#ff6569', padding: '30px' }}>
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            backgroundColor: isDark ? '#1e1e1e' : '#fff',
            padding: '30px',
            borderRadius: '10px',
          }}
        >
          <h1 style={{ textAlign: 'center', color: isDark ? '#fff' : '#343a40' }}>📝 To-Do List</h1>

          {/* Filter */}
          <div style={{ textAlign: 'right', marginBottom: '10px' }}>
            <label style={{ marginRight: '10px' }}>Filter:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '5px' }}
            >
              <option value="All">All</option>
              <option value="Not Start">Not Start</option>
              <option value="Process">Process</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Task Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: isDark ? '#444' : '#e9ecef' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Task</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Start</th>
                <th style={thStyle}>End</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTodos.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    No tasks found.
                  </td>
                </tr>
              ) : (
                filteredTodos.map((todo, index) => (
                  <tr key={todo._id}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>{todo.text}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '5px',
                          backgroundColor:
                            todo.status === 'Completed'
                              ? '#28a745'
                              : todo.status === 'Process'
                              ? '#ffc107'
                              : 'grey',
                          color: 'white',
                        }}
                      >
                        {todo.status}
                      </span>
                    </td>
                    <td style={tdStyle}>{todo.startDate}</td>
                    <td style={tdStyle}>{todo.endDate}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleEdit(todo)} style={actionBtn('#ffc107', '#000')}>
                        ✏️ Edit
                      </button>{' '}
                      <button
                        onClick={() => handleDelete(todo._id)}
                        style={actionBtn('#dc3545', '#fff')}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Show Input Form */}
          {!showInput ? (
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => {
                  setShowInput(true);
                  setEditTodo(null);
                }}
                style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                + Add New Task
              </button>
            </div>
          ) : (
            <div
              style={{
                marginTop: '20px',
                padding: '15px',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                backgroundColor: isDark ? '#333' : '#f8f9fa',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Enter task"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={inputStyle}
                />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={inputStyle}
                >
                  <option value="Not Start">Not Start</option>
                  <option value="Process">Process</option>
                  <option value="Completed">Completed</option>
                </select>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleAddOrUpdate} style={actionBtn('#007bff', 'white')}>
                    {editTodo ? 'Update' : 'Add'}
                  </button>
                  <button onClick={resetForm} style={actionBtn('#6c757d', 'white')}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          © {new Date().getFullYear()} Smart Todo App
          {showAbout && <div style={{ fontWeight: 'bold', marginTop: '5px' }}>Created by Smart</div>}
        </div>
      </div>
    </div>
  );
}

export default Mainpage;
