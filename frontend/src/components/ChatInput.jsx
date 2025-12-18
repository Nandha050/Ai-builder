import { useState } from "react";

export default function ChatInput({ onSubmit }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSubmit(text, files);
    setText("");
    setFiles([]);
  };

  return (
    <div className="p-4 border-t flex gap-2">
      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border px-3 py-2 rounded"
        placeholder="Ask something..."
      />

      <button onClick={handleSend} className="bg-black text-white px-4 rounded">
        Send
      </button>
    </div>
  );
}
