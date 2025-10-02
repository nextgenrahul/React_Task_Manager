import Login from "./pages/Login";
import Register from "./pages/Register"
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import TaskFrom from "./components/TaskForm";
import RedirectToTasksOrSignup from "./components/RedirectToTasksOrSignup";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RedirectToTasksOrSignup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TaskFrom />
          </ProtectedRoute>
        }
      />
    </>
  )
);

export default router;
