import MarkdownRenderer from "../MarkdownRenderer";

export default function AnalysisResult({ content }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-4xl">
      <MarkdownRenderer content={content} />
    </div>
  );
}
