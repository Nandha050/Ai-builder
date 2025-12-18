import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import AgentStatus from "../components/AgentStatus";
import AgentTimeline from "../components/AgentTimeline";
import { fetchTasks, fetchTaskById, createTask } from "../api/taskApi";
import React from "react";


export default function Chat() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [messages, setMessages] = useState([]);

  const pollingRef = useRef(null);

  useEffect(() => {
    loadTasks();
    return () => clearInterval(pollingRef.current);
  }, []);

  const loadTasks = async () => {
    const res = await fetchTasks();
    setTasks(res.data);
  };

  // 🔁 POLLING
const pollTaskStatus = (taskId) => {
  if (!taskId) return;

  const interval = setInterval(async () => {
    try {
      const res = await fetchTaskById(taskId);
      setActiveTask(res.data);

      if (res.data.task.status === "completed") {
        setMessages((prev) => [
          ...prev.filter(m => m.content !== "Processing your task..."),
          {
            role: "assistant",
            content: res.data.task.result_summary || "Task completed."
          }
        ]);
        clearInterval(interval);
        loadTasks();
      }
    } catch (err) {
      console.error("Polling failed", err);
      clearInterval(interval);
    }
  }, 2000);
};





  // 🚀 NEW TASK

const handleNewTask = async (payload) => {
  setMessages([
    { role: "user", content: payload.prompt },
    { role: "assistant", content: "Processing your task..." }
  ]);

  try {
    const res = await createTask(payload);
    const createdTask = res.data.task;

    const taskId = createdTask?.id || createdTask?._id;

    if (!taskId) {
      console.error("Backend response:", res.data);
      throw new Error("Task ID missing");
    }

    pollTaskStatus(taskId);
  } catch (err) {
    console.error(err);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "❌ Failed to start task." }
    ]);
  }
};

const streamTaskOutput =  (taskId) => {
  const eventSource = new EventSource(
    `http://localhost:5000/api/tasks/${taskId}/stream`
  );

  eventSource.onmessage = (event) => {
    if (event.data === "[DONE]") {
      eventSource.close();
      return;
    }

    const chunk = JSON.parse(event.data);

    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last.role === "assistant") {
        return [
          ...prev.slice(0, -1),
          { ...last, content: last.content + chunk }
        ];
      }
      return prev;
    });
  };
};




  return (
    <div className="flex h-screen">
      <Sidebar
        tasks={tasks}
        onSelect={(task) => {
          setActiveTask(task);

          setMessages([
            { role: "user", content: task.userPrompt },
            {
              role: "assistant",
              content:
                task.status === "completed"
                  ? task.result_summary
                  : "Processing your task..."
            }
          ]);

          if (task.status !== "completed") {
            pollTaskStatus(task._id);
          }
        }}
      />

      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {messages.map((m, i) => (
            <ChatMessage key={i} role={m.role} content={m.content} />
          ))}

          {activeTask?.subtasks && (
<AgentTimeline subtasks={activeTask.subtasks} />
          )}
        </div>

        <ChatInput onSubmit={handleNewTask} />
      </div>
    </div>
  );
}
