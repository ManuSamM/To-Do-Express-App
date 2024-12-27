/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Task {
  _id: string;
  task: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<string>("");
  const [editTaskId, setEditTaskId] = useState<string | null>(null); // State for editing task
  const [editTaskText, setEditTaskText] = useState<string>(""); // State for task text when editing
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");

    if (!savedToken) {
      router.push("/login");
      return;
    }

    setToken(savedToken);
    setUsername(savedUsername || "User");
    fetchTasks(savedToken);
  }, [router]);

  const fetchTasks = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/tasks", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch tasks.");

      const data = await res.json();

      setTasks(data);
    } catch (err) {
      alert("Failed to fetch tasks.");
    }
  };

  const handleAddTask = async () => {
    try {
      const res = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ task }),
      });
      if (!res.ok) throw new Error("Failed to add task.");
      const data = await res.json();
      setTasks([...tasks, data]);
      setTask("");
    } catch (err) {
      alert("Failed to add task.");
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete task.");
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      alert("Failed to delete task.");
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!res.ok) throw new Error("Failed to update task.");
      const data = await res.json();
      setTasks(tasks.map((task) => (task._id === id ? data : task)));
    } catch (err) {
      alert("Failed to update task.");
    }
  };

  const handleEditTask = (task: Task) => {
    setEditTaskId(task._id);
    setEditTaskText(task.task);
  };

  const handleSaveEdit = async () => {
    if (editTaskId && editTaskText) {
      try {
        const res = await fetch(`http://localhost:5000/tasks/${editTaskId}/edit`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ task: editTaskText }),
        });
        if (!res.ok) throw new Error("Failed to edit task.");
        const data = await res.json();
        setTasks(tasks.map((task) => (task._id === data._id ? data : task)));
        setEditTaskId(null);
        setEditTaskText("");
      } catch (err) {
        alert("Failed to edit task.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/login");
  };

  return (
    <div>
      <h1>To-Do List {username && <>of {username}</>}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTask();
        }}
      >
        <input
          type="text"
          placeholder="New Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
      <ol>
        {tasks.map((task) => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task._id, task.completed)}
            />
            {editTaskId === task._id ? (
              <>
                <input
                  type="text"
                  value={editTaskText}
                  onChange={(e) => setEditTaskText(e.target.value)}
                />
                <button onClick={handleSaveEdit}>Save</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.task}
                </span>
                <button
                  onClick={() => handleEditTask(task)}
                  style={{ marginLeft: "1em" }}
                >
                  Edit
                </button>
              </>
            )}
            <button
              onClick={() => handleDeleteTask(task._id)}
              style={{ marginLeft: "1em" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}