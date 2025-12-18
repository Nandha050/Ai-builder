import MarkdownRenderer from "./MarkdownRenderer";

export default function ChatResultCard({ title, content }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold text-indigo-400 mb-4">
        {title}
      </h2>

      <MarkdownRenderer content={content} />
    </div>
  );
}
