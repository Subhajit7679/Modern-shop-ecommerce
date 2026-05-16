import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // role === 1 means admin
  if (
    user &&
    user.user &&
    user.user.role === 1
  ) {

    return children;

  }

  return <Navigate to="/" />;
}

export default AdminRoute;