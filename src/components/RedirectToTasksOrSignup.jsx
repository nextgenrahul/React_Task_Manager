import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function RedirectToTasksOrSignup() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return <Navigate to={isAuthenticated ? "/tasks" : "/signup"} />;
}

export default RedirectToTasksOrSignup;
