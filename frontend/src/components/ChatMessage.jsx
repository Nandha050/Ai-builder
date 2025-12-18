import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-3xl px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${
            isUser
              ? "bg-indigo-600 text-white"
              : "bg-[#111827] text-gray-200"
          }`}
      >
        {isUser ? (
          content
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
