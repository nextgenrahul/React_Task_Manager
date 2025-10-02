import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../features/tasks/tasksSlice.js";
import TaskList from "./TaskList.jsx";
import { logOut } from "../features/auth/authSlice.js";
import { useTheme } from "../context/ThemeContext.jsx"; // Updated extension
import { Navigate } from "react-router-dom";

const TaskForm = () => {
  const [task, setTask] = useState("");
  const [error, setError] = useState("");
  const [priority, setPriority] = useState("");
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { themeMode, darkTheme, lightTheme } = useTheme();
  if (!isAuthenticated) return <Navigate to="/login" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim() === "") {
      setError("Task cannot be empty");
      return;
    }
    setError("");
    
    const newTask = {
      id: Date.now(),
      task: task.trim(),
      completed: false,
      priority,
    };
    dispatch(addTask(newTask));
    setPriority("low");
    setTask("");
  };
  useEffect(() => {
    sessionStorage.setItem("themeSet", JSON.stringify({ themeMode }));
  }, [themeMode]);

  return (
    <div
      className={`flex flex-col items-center min-h-screen ${
        themeMode === "light"
          ? "bg-gradient-to-r from-blue-500 to-purple-600"
          : "bg-gray-900"
      } p-8`}
    >
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={lightTheme}
          className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
            themeMode === "light"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Light Theme
        </button>
        <button
          onClick={darkTheme}
          className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
            themeMode === "dark"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Dark Theme
        </button>
      </div>
      <h2 className="text-4xl font-semibold text-white text-center mb-10">
        Add a New Task
      </h2>
      <button
        type="button"
        onClick={() => dispatch(logOut())}
        className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition duration-200 mb-4"
      >
        Log Out
      </button>
      <form
        onSubmit={handleSubmit}
        className={`${
          themeMode === "light" ? "bg-white" : "bg-gray-800"
        } shadow-md rounded-xl p-6 w-full max-w-2xl flex items-center gap-4`}
      >
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter your task"
          className={`flex-1 px-4 py-3 rounded-lg border ${
            themeMode === "light"
              ? "border-gray-300 focus:ring-blue-500"
              : "border-gray-600 bg-gray-700 text-white focus:ring-blue-400"
          } focus:outline-none focus:ring-2 transition duration-150`}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className={`flex-1 px-4 py-3 rounded-lg border ${
            themeMode === "light"
              ? "border-gray-300 focus:ring-blue-500"
              : "border-gray-600 bg-gray-700 text-white focus:ring-blue-400"
          } focus:outline-none focus:ring-2 transition duration-150`}
        >
          <option value="low">Low Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
        >
          Add
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <TaskList />
    </div>
  );
};

export default TaskForm;
