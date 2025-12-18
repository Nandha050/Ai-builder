import MarkdownRenderer from "../MarkdownRenderer";

export default function GenericResult({ content }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
      <MarkdownRenderer content={content} />
    </div>
  );
}
