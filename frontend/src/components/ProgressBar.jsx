export default function ProgressBar({ subtasks }) {
  const completed = subtasks.filter(s => s.status === "completed").length;
  const percent = Math.round((completed / subtasks.length) * 100);

  return (
    <div className="w-full bg-gray-200 rounded">
      <div
        className="bg-green-500 text-xs text-white p-1 rounded"
        style={{ width: `${percent}%` }}
      >
        {percent}%
      </div>
    </div>
  );
}
