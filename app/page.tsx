"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful assistant.");
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    setLoading(true);

    const newChat = [...chat, { role: "user", content: userInput }];
    setChat(newChat);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt, messages: newChat }),
    });

    const data = await response.json();
    setChat([...newChat, { role: "assistant", content: data.reply }]);
    setUserInput("");
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <Textarea
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)}
        placeholder="Set system prompt..."
      />
      <div className="border p-4 rounded-lg h-80 overflow-y-auto">
        {chat.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right" : ""}>
            <p className="text-sm font-bold">{msg.role === "user" ? "You" : "AI"}</p>
            <p className="p-2 bg-gray-100 rounded-md inline-block">{msg.content}</p>
          </div>
        ))}
      </div>
      <Input
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <Button onClick={sendMessage} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </Button>
    </div>
  );
}