import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [dark, setDark] = useState(true);

  // LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));

    const theme = localStorage.getItem("theme");
    if (theme) setDark(theme === "dark");
  }, []);

  // Feladatmentés
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Theme mentés
  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const addTask = () => {
    if (!text.trim()) return;
    const newTask = { id: Date.now(), text, done: false };
    setTasks([newTask, ...tasks]);
    setText("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const total = tasks.length;
  const completed = tasks.filter((t) => t.done).length;
  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className={dark ? "app dark" : "app light"}>
      <div className="container">

        <div className="top-bar">
         <h1 className="title">Feladatok:</h1>
          
          <button className="theme-btn" onClick={() => setDark(!dark)}>
            {dark ? "LIGHT" : "DARK"}
          </button>
        </div>

        {/* Progress Bar */}
        {total > 0 && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
            <span className="progress-text">{completed} / {total} kész</span>
          </div>
        )}

        <div className="input-row">
          <input
            className="task-input"
            placeholder="Adj meg egy feladatot"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button className="add-btn" onClick={addTask}>Hozzáad</button>
        </div>

        <div className="task-list">
          {tasks.length === 0 && <p className="empty">Jelenleg nincs feladatod.</p>}
          {tasks.map((task) => (
            <div key={task.id} className="task">
              <span
                className={task.done ? "task-text done" : "task-text"}
                onClick={() => toggleTask(task.id)}
              >
                {task.text}
              </span>

              <div className="actions">
                <button className="complete-btn" onClick={() => toggleTask(task.id)}>✓</button>
                <button className="delete-btn" onClick={() => deleteTask(task.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

