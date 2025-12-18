const STATUS_COLOR = {
  pending: "bg-gray-600",
  running: "bg-yellow-400",
  completed: "bg-green-500",
  failed: "bg-red-500"
};

export default function AgentTimeline({ subtasks }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Agent Progress
      </h3>

      <div className="space-y-3">
        {subtasks.map((s) => (
          <div key={s._id} className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${STATUS_COLOR[s.status]}`} />
            <span className="capitalize text-gray-200">
              {s.agent_type}
            </span>
            <span className="ml-auto text-xs text-gray-400">
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
