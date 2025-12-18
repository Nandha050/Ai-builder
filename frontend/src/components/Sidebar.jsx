export default function Sidebar({ tasks, onSelect }) {
  return (
    <div className="w-72 bg-[#0000] border-r border-gray-800 p-4">
      <h2 className="text-lg font-semibold text-white mb-4">Tasks</h2>

      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-100px)]">
        {tasks.map((t) => (
          <button
            key={t._id}
            onClick={() => onSelect(t)}
            className="w-full flex items-center justify-betweentext-left p-3 rounded-lg bg-[white/5]
                       hover:bg-[grey] transition padding-left: 10px"
          >
            <div className="text-sm text-white truncate">{t.title}</div>
            <div
              className={`text-xs mt-1 ${
                t.status === "completed"
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              {t.status}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
