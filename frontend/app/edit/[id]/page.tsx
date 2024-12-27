// app/edit/[id]/page.tsx

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Task {
  _id: string;
  task: string;
  completed: boolean;
}

export default function EditTask() {
  const [editTaskText, setEditTaskText] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      router.push("/login");
      return;
    }
    setToken(savedToken);

    // Get task data from localStorage
    const taskData = localStorage.getItem("currentEditTask");
    if (taskData) {
      const task = JSON.parse(taskData);
      setEditTaskText(task.task);
    } else {
      // If no task data, go back to main page
      router.push("/");
    }
  }, [router, taskId]);

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/tasks/${taskId}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ task: editTaskText }),
      });
      if (!res.ok) throw new Error("Failed to edit task.");
      // Clear the stored task data
      localStorage.removeItem("currentEditTask");
      router.push("/");
    } catch (err) {
      alert("Failed to edit task.");
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("currentEditTask");
    router.push("/");
  };

  return (
    <div>
      <h1>Edit Task</h1>
      <div>
        <input
          type="text"
          value={editTaskText}
          onChange={(e) => setEditTaskText(e.target.value)}
        />
        <button onClick={handleSaveEdit}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
}
