export default function EmailResult({ content }) {
  const subjectMatch = content.match(/Subject:(.*)/i);
  const subject = subjectMatch ? subjectMatch[1].trim() : "Email";

  const body = content.replace(/Subject:.*\n?/i, "");

  return (
    <div className="bg-white text-gray-900 rounded-xl shadow p-6 max-w-3xl">
      <div className="border-b pb-3 mb-4">
        <h3 className="text-sm text-gray-500">Subject</h3>
        <h2 className="text-lg font-semibold">{subject}</h2>
      </div>

      <div className="whitespace-pre-line leading-relaxed">
        {body}
      </div>
    </div>
  );
}
