export default function Sidebar({ tasks, onSelect }) {
  return (
    <div className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-lg font-semibold mb-4">Tasks</h2>

      <div className="space-y-2">
        {tasks.map((t) => (
          <button
            key={t._id}
            onClick={() => onSelect(t)}
            className="block w-full text-left p-2 rounded hover:bg-gray-700"
          >
            <div className="text-sm">{t.title}</div>
            <div className="text-xs text-gray-400">{t.status}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
