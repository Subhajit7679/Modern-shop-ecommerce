import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // NOT LOGIN
  if (!user) {
    return <Navigate to="/login" />;
  }

  // NOT ADMIN
  if (user?.user?.role !== 1) {
    return <Navigate to="/" />;
  }

  // ADMIN
  return children;
}

export default AdminRoute;