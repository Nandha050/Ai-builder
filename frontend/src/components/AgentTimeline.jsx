const STATUS_COLOR = {
  pending: "bg-gray-600",
  running: "bg-yellow-400",
  completed: "bg-green-500",
  failed: "bg-red-500"
};

export default function AgentTimeline({ subtasks }) {
  return (
    <div className="mt-4 space-y-3">
      {subtasks.map((s) => (
        <div
          key={s._id}
          className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm"
        >
          {/* Status Dot */}
          <span
            className={`w-3 h-3 rounded-full ${
              s.status === "completed"
                ? "bg-green-500"
                : s.status === "running"
                ? "bg-blue-500 animate-pulse"
                : s.status === "failed"
                ? "bg-red-500"
                : "bg-gray-300"
            }`}
          />

          {/* Agent Info */}
          <div className="flex-1">
            <div className="font-medium capitalize">{s.agent_type}</div>
            <div className="text-xs text-gray-500">{s.description}</div>
          </div>

          {/* Status Text */}
          <span className="text-xs capitalize text-gray-600">
            {s.status}
          </span>
        </div>
      ))}
    </div>
  );
}
