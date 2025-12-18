import { useEffect, useState } from "react";
import { fetchTasks } from "../api/taskApi";
import TaskCard from "./TaskCard";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks().then(res => setTasks(res.data));
  }, []);

  return (
    <div>
      {tasks.map(task => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}
