"use client";
import { useState } from "react";
import axios from "axios";

interface Message {
  role: "user" | "ai";
  content: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: "user", content: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chat", { prompt: input });
      const aiMessage: Message = { role: "ai", content: response.data.reply };

      setMessages([...messages, newMessage, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...messages, newMessage, { role: "ai", content: "Error: Unable to fetch response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#ffffff] dark:bg-[#1c1d1f] p-6 rounded-lg shadow-lg min-h-[500px] flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[75%] ${
              msg.role === "user"
                ? "bg-[#ECE6EE] text-[#000000] self-end"
                : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <p className="text-gray-500">Thinking...</p>}
      </div>

      <div className="mt-4 flex items-center border-t p-3">
        <input
          type="text"
          className="flex-1 p-3 border rounded-lg bg-[#ECE6EE] dark:bg-gray-800 text-[#000000] dark:text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a legal question..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-5 py-2 bg-[#1c1d1f] dark:bg-[#ECE6EE] text-white dark:text-[#000000] rounded-lg"
          disabled={loading}
        >
          {loading ? "Loading..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
