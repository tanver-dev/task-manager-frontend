import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  const [editId, setEditId] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "low",
    dueDate: "",
    assignedTo: undefined,
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      if (user?.role === "admin" || user?.role === "manager") {
        const res = await api.get("/users");

        setUsers(res.data);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");

      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  // Add task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return;

    try {
      editId
        ? await api.put(`/tasks/${editId}`, { ...form })
        : await api.post("/tasks", { ...form });
      setForm({
        title: "",
        description: "",
        status: "todo",
        priority: "low",
        dueDate: "",
        assignedTo: "",
      });
      setEditId(false);
      fetchTasks();
    } catch (err) {
      console.error("Error adding/updating task", err);
    }
  };

  // Delete task
const handleDel = async (id) => {
  if (!window.confirm("Are you sure you want to delete this task?")) return;

  try {
    await api.delete(`/tasks/${id}`);
    setTasks((prevTasks) => prevTasks.filter((t) => t._id !== id));
  } catch (err) {
    alert(err.response?.data?.message || "Something went wrong");
    console.error(err);
  }
};


  // Edit task
  const handleEdit = async (id) => {
    try {
      const res = await api.get(`tasks/${id}`);
      const task = res.data;
      setEditId(task._id);
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "low",
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
        assignedTo: task.assignedTo || undefined,
      });
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.log("error ", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>

      {/* Add Task Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-4 rounded shadow"
      >
        <input
          type="text"
          placeholder="Title"
          className="w-full mb-2 p-2 border rounded"
          value={form.title}
          name="title"
          onChange={(e) =>
            setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
        />
        <textarea
          placeholder="Description"
          className="w-full mb-2 p-2 border rounded"
          value={form.description}
          name="description"
          onChange={(e) =>
            setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
        />
        <select
          name="status"
          value={form.status}
          className="w-full mb-2 p-2 border rounded"
          onChange={(e) =>
            setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
        >
          <option value={null}>select status</option>
          <option>todo</option>
          <option>in-progress</option>
          <option>done</option>
        </select>

        <select
          name="priority"
          value={form.priority}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
          className="w-full mb-2 p-2 border rounded"
        >
          <option value={null}>Select priority</option>
          <option>low</option>
          <option>medium</option>
          <option>high</option>
        </select>
        {(user.role === "admin" || user.role === "manager") && (
          <select
            name="assignedTo"
            value={form.assignedTo || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            className="w-full mb-2 p-2 border rounded"
          >
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        )}

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
          className="w-full mb-2 p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          {editId ? "Update Task" : "Add Task"}
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="p-4 bg-gray-100 rounded flex flex-col md:flex-row justify-between items-center "
          >
            <div className="w-full">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-xs text-gray-400">
                Status: {task.status} | Priority: {task.priority}
              </p>

              {task.dueDate && (
                <p className="text-xs text-gray-400">
                  DueDate: {new Date(task.dueDate).toLocaleDateString("en-IN")}
                </p>
              )}
              {task.createdBy && (
                <p className="text-xs text-gray-400">
                  CreatedBy: {task.createdBy.name}
                </p>
              )}
              {task.assignedTo && (
                <p className="text-xs text-gray-400">
                  AssignedTo: {task.assignedTo.name}
                </p>
              )}
            </div>
            <div className="flex-row md:flex-col flex justify-between w-full md:w-auto mt-4">
              <button
                onClick={() => handleDel(task._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 mb-2 rounded"
              >
                Delete
              </button>{" "}
              <button
                onClick={() => handleEdit(task._id)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
