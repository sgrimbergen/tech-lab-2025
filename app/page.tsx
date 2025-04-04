"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [productRecognitionPrompt, setRecognitionPrompt] = useState("You are a helpful assistant.");
  const [productSearchPrompt, setSearchrompt] = useState("You are a helpful assistant.");
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [productList, setProductList] = useState<{ item: string; quantity: number; unit: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    setLoading(true);

    const newChat = [{ role: "user", content: userInput }];
    setChat(newChat);

    setProductList([])

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt: productRecognitionPrompt, messages: newChat }),
    });

    const data = await response.json();
    console.log("Model reply: ", data)
    // The reply should look like this:
    // { "order": [{ "item": "tomatoes", "quantity": 5, "unit": "bags", "sku": 8134 },...]}

    try {
      const jsonOrderData = JSON.parse(data.reply);
      console.log("Parsed JSON:", jsonOrderData); // Debugging

      if (jsonOrderData && jsonOrderData.order && typeof jsonOrderData.order === "object") {
        const order = jsonOrderData.order;
        const updatedProductList = [];

        for (const item of order) {
          try {
            // Here we send a message to the search LLM with only the product name.
            // Based on this, the model should answer with a list of objects which at least contain a name field.
            // In line 60 you can see we use that name.
            const searchRes = await fetch("/api/search", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ systemPrompt: productSearchPrompt, product: [{ role: "user", content: item.item }] }),
            });
            const searchData = await searchRes.json();
            console.log("Search results:", searchData)
            const jsonSearchData = JSON.parse(searchData.reply);

            if (jsonSearchData && Array.isArray(jsonSearchData)) {
              // Update the product list with product names from the search result
              updatedProductList.push({
                item: jsonSearchData[0].name, // Use the first match
                quantity: item.quantity,
                unit: item.unit,
              });
            }

          } catch (error) {
            console.error(`Failed to fetch details for ${item.item}:`, error);
          }
        }
        setProductList(updatedProductList);
        setChat([...newChat, { role: "assistant", content: "Your updated order is displayed below!" }]);
      } else {
        console.log("Invalid order format:", jsonOrderData);
        setChat([...newChat, { role: "assistant", content: "Invalid order format. Check console." }]);
      }
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      setChat([...newChat, { role: "assistant", content: "Failed to parse JSON. Check console." }]);
    }
    setUserInput("");
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-lg font-bold"> Add your product recognition prompt here: </h2>
      <Textarea
        value={productRecognitionPrompt}
        onChange={(e) => setRecognitionPrompt(e.target.value)}
        placeholder="Set system prompt..."
      />
      <h2 className="text-lg font-bold"> Add your search prompt here: </h2>
      <Textarea
        value={productSearchPrompt}
        onChange={(e) => setSearchrompt(e.target.value)}
        placeholder="Set system prompt..."
      />
      <div className="border p-4 rounded-lg h-80 overflow-y-auto">
        {chat.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right" : ""}>
            <p className="text-sm font-bold">{msg.role === "user" ? "You" : "AI"}</p>
            <p className="p-2 bg-gray-400 rounded-md inline-block">{msg.content}</p>
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
      <div className="mt-6">
        <h2 className="text-lg font-bold">Product List:</h2>
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-400">
              <th className="border p-2">Item</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Unit</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((product, index) => (
              <tr key={index}>
                <td className="border p-2">{product.item}</td>
                <td className="border p-2">{product.quantity}</td>
                <td className="border p-2">{product.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}