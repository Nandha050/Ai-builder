export default function AgentStatus({ subtasks }) {
  return (
    <div className="mt-4 max-w-2xl mx-auto bg-white rounded-xl p-4 shadow">
      <h4 className="text-sm font-semibold mb-3">Agent Progress</h4>

      {subtasks.map((s) => (
        <div key={s._id} className="flex justify-between text-xs mb-2">
          <span className="capitalize">{s.agent_type}</span>
          <span
            className={
              s.status === "completed"
                ? "text-green-600"
                : s.status === "failed"
                ? "text-red-600"
                : "text-yellow-500 animate-pulse"
            }
          >
            {s.status}
          </span>
        </div>
      ))}
    </div>
  );
}
