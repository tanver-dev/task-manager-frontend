import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await api.get("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Logout Failed");
    }
  }
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between sticky top-0">
      <div className="flex space-x-4 items-center">
        <Link className="font-bold text-lg" to="/">
          Tasks
        </Link>
      </div>
      <div>
        {user ? (
          <>
            <span className="mr-4">Hello, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex space-x-4">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `ml-2 ${isActive ? "text-yellow-300" : "text-white"}`
              }
            >
              Login
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `ml-2 ${isActive ? "text-yellow-300" : "text-white"}`
              }
              to={"/register"}
            >
              Signup
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
