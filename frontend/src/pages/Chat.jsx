import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import AgentStatus from "../components/AgentStatus";
import { createTask,fetchTasks, fetchTaskById } from "../api/taskApi";
import TaskResult from "../components/TaskResult";

export default function Chat() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [messages, setMessages] = useState([]);
  const pollingRef = useRef(null);
const [hasFinalResponse, setHasFinalResponse] = useState(false);

  useEffect(() => {
    loadTasks();
    return () => stopPolling();
  }, []);

  // 🔄 Load task list
  const loadTasks = async () => {
    const res = await fetchTasks();
    setTasks(res.data);
  };

  // 🛑 Stop polling safely
  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  // 🔁 Poll task status
 const pollTaskStatus = (taskId) => {
  if (polling) return;

  setPolling(true);
  setHasFinalResponse(false);

  const interval = setInterval(async () => {
    const res = await fetchTaskById(taskId);
    setActiveTask(res.data);

    if (
      res.data.task.status === "completed" &&
      !hasFinalResponse
    ) {
      setHasFinalResponse(true);

      setMessages((prev) => [
        ...prev.filter(m => m.role !== "assistant" || m.content !== "Processing your task..."),
        {
          role: "assistant",
          content: res.data.task.result_summary || "Task completed."
        }
      ]);

      clearInterval(interval);
      setPolling(false);
      loadTasks();
    }
  }, 2000);
};


  // 🚀 When user submits prompt
 const handleNewTask = async (prompt, files) => {
  
  // 1️⃣ Show user message immediately
  setMessages((prev) => [
    ...prev,
    { role: "user", content: prompt },
    { role: "assistant", content: "Processing your task..." }
  ]);

  // 2️⃣ CREATE TASK IN BACKEND
const res = await createTask(prompt, files);  
const task = res.data.task;

  // 3️⃣ Set active task
  setActiveTask(task);

  // 4️⃣ Start polling
  pollTaskStatus(task.id);
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
        <div className="flex-1 overflow-y-auto p-6">
          {messages.map((m, i) => (
            <ChatMessage key={i} role={m.role} content={activeTask && <TaskResult task={activeTask} />}
 />
          ))}

          {activeTask?.subtasks && (
            <AgentStatus subtasks={activeTask.subtasks} />
          )}
        </div>

        <ChatInput onSubmit={handleNewTask} />
      </div>
    </div>
  );
}
