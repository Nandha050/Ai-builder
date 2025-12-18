import TaskList from "../components/TaskList";

export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">
        AI Task Dashboard
      </h1>
      <TaskList />
    </div>
  );
}
