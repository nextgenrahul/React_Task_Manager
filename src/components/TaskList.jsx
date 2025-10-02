import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useContext,
  useEffect,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleEvent,
  deleteTask,
  updateTask,
} from "../features/tasks/tasksSlice";
import { ThemeContext, useTheme } from "../context/ThemeContext";

function TaskList() {
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();
  const { themeMode } = useTheme();

  // States
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const selectRef = useRef(null);

  // Event handlers with useCallback
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    searchInputRef.current.focus();
  }, []);
  useEffect(() => {
    if (editId && selectRef.current) {
      selectRef.current.focus();
      selectRef.current.select();
    }
  }, [editId]);
  const handleEditStart = useCallback((id, task) => {
    setEditId(id);
    setEditText(task);
  }, []);

  const handleEditSave = useCallback(() => {
    if (editText.trim()) {
      dispatch(updateTask({ id: editId, task: editText }));
    }
    setEditId(null);
    setEditText("");
  }, [dispatch, editId, editText]);

  // Filtered tasks with useMemo
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const taskText = (task.task || "").toLowerCase();
      const matchesSearch = taskText.includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "complete"
          ? task.completed
          : filter === "incomplete"
          ? !task.completed
          : filter === "high"
          ? task.priority === "high"
          : task.priority === "low";
      return matchesSearch && matchesFilter;
    });
  }, [tasks, filter, searchQuery]);

  // Task counts with useMemo
  const taskCounts = useMemo(
    () => ({
      total: filteredTasks.length,
      complete: filteredTasks.filter((t) => t.completed).length,
      incomplete: filteredTasks.filter((t) => !t.completed).length,
    }),
    [filteredTasks]
  );

  return (
    <div
      className={`max-w-xl mx-auto w-[500px] mt-10 p-4 rounded ${
        themeMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex gap-2 mb-4">
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search tasks..."
          className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
            themeMode === "light"
              ? "bg-blue-100 text-black"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="bg-red-600 text-white p-2 rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Dropdown */}
      <select
        value={filter}
        onChange={handleFilterChange}
        className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
          themeMode === "light"
            ? "bg-blue-100 text-black"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        <option value="all">All</option>
        <option value="complete">Complete</option>
        <option value="incomplete">Incomplete</option>
        <option value="high">High Priority</option>
        <option value="low">Low Priority</option>
      </select>

      {/* Task Counts */}
      <div className="mb-4">
        <p>Total: {taskCounts.total}</p>
        <p>Complete: {taskCounts.complete}</p>
        <p>Incomplete: {taskCounts.incomplete}</p>
      </div>

      {/* Task List */}
      <ul className="space-y-4">
        {filteredTasks.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-800 text-white rounded-xl shadow-lg px-6 py-4"
          >
            <input
              type="checkbox"
              checked={!!t.completed}
              onChange={() => dispatch(toggleEvent(t.id))}
              className="w-5 h-5 accent-white"
            />
            {editId === t.id ? (
              <input
                ref={selectRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 mx-4 px-2 py-1 rounded text-black"
              />
            ) : (
              <input
                type="text"
                value={t.task}
                readOnly
                className="flex-1 mx-4 px-2 py-1 rounded border-1 border-blue-800 text-black"
              />
            )}
            <button
              onClick={() => dispatch(deleteTask(t.id))}
              className="hover:text-yellow-300 transition text-2xl"
            >
              ❌
            </button>
            {editId === t.id ? (
              <button
                onClick={handleEditSave}
                className="text-green-300 hover:text-green-100 text-2xl ml-2"
              >
                ✅
              </button>
            ) : (
              <button
                onClick={() => handleEditStart(t.id, t.task)}
                className="hover:text-yellow-300 text-2xl ml-2"
              >
                ✏️
              </button>
            )}
          </li>
        ))}
        {filteredTasks.length === 0 && (
          <p className="text-center">No tasks found.</p>
        )}
      </ul>
    </div>
  );
}

export default TaskList;
