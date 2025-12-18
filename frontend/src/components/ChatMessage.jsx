export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`mb-6 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed
        ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-white text-gray-900 rounded-bl-none shadow"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
