import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [err, setErr] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleInput = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name) {
      setErr("All fields are required");
      return;
    }

    try {
      let res = await api.post("/auth/register", formData);
      setUser(res.data.user);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      setErr(error?.response?.data?.message || "Signup Failed");
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-80 flex flex-col gap-4 border border-solid shadow-lg rounded-lg p-5 bg-white relative"
      >
        <h2 className="text-lg font-bold">Signup</h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 outline-slate-400 border border-solid rounded"
          name="name"
          value={formData.name}
          onChange={handleInput}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 outline-slate-400 border border-solid rounded"
          name="email"
          value={formData.email}
          onChange={handleInput}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 outline-slate-400 border border-solid rounded"
          name="password"
          value={formData.password}
          onChange={handleInput}
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleInput}
          className="w-full p-2 outline-slate-400 border border-solid rounded"
        >
          <option value="user">User</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <button className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
          SignUp
        </button>
        <Link className="block text-right text-blue-500 -mt-2 " to={"/login"}>
          Login
        </Link>

        {err && <p className="text-red-500 absolute bottom-5">{err}</p>}
      </form>
    </div>
  );
};

export default Register;
