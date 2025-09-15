import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { setUser, setLoading } = useAuth();
  const navigate = useNavigate();
  const [err, setErr] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErr("All fields are required");
      return;
    }

    try {
      let res = await api.post("/auth/login", formData);
      setUser(res.data.user);
      setFormData({
        email: "",
        password: "",
      });
      navigate('/')
    } catch (err) {
      setErr(err.response?.data?.message || "Login failed");
    } 
  };

  const handleInput = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErr(null);
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded shadow-md w-80 border border-solid relative"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded outline-slate-500"
          value={formData.email}
          name="email"
          onChange={handleInput}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded outline-slate-500"
          value={formData.password}
          name="password"
          onChange={handleInput}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Login
        </button>

        <Link
          className="block text-right text-blue-500 -mb-2 mt-2"
          to={"/register"}
        >
          Signup
        </Link>

        {err && <p className="text-red-500 absolute bottom-2">{err}</p>}
      </form>
    </div>
  );
};

export default Login;
