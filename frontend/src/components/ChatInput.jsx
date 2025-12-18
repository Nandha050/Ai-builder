import { useState } from "react";

export default function ChatInput({ onSubmit }) {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  const handleSend = () => {
    if (!input && !file) return;

    onSubmit({ prompt: input, file });
    setInput("");
    setFile(null);
  };

  return (
    <div className="border-t p-4 bg-white">
      {file && (
        <div className="mb-2 flex items-center gap-2 text-sm bg-gray-100 p-2 rounded">
          📎 {file.name}
          <button
            className="text-red-500 ml-auto"
            onClick={() => setFile(null)}
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 border rounded px-3 py-2"
        />

        <input
          type="file"
          hidden
          id="fileUpload"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <label
          htmlFor="fileUpload"
          className="cursor-pointer px-3 py-2 border rounded"
        >
          📎
        </label>

        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
