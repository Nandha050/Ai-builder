import { useEffect, useState } from "react";
import { fetchTaskById } from "../api/taskApi";
import ProgressBar from "./ProgressBar";
import TaskResult from "./TaskResult";
import AgentTimeline from "./AgentTimeline";


export default function TaskCard({ task }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const res = await fetchTaskById(task._id);
        setDetails(res.data);
      } catch (err) {
        console.error("Failed to load task details", err);
      }
    };

    loadDetails();
    const interval = setInterval(loadDetails, 3000);
    return () => clearInterval(interval);
  }, [task._id]);

  if (!details) {
    return (
      <div className="border p-4 rounded mb-4">
        Loading task details...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-6">
  <div className="flex justify-between items-center">
    <h3 className="text-lg font-semibold">{task.title}</h3>
    <span className={`px-3 py-1 rounded-full text-sm
      ${details.task.status === "completed" ? "bg-green-100 text-green-700" :
        "bg-yellow-100 text-yellow-700"}
    `}>
      {details.task.status}
    </span>
  </div>

  <div className="mt-3">
    <ProgressBar subtasks={details.subtasks} />
  </div>

  <AgentTimeline subtasks={details.subtasks} />

  {details.task.status === "completed" && (
    <TaskResult result={details.task.result_summary} />
  )}
    </div>
  );
}
