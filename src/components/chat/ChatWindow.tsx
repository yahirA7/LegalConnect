"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToMessages, sendMessage } from "@/lib/firestore";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  chatId: string;
  currentUserId: string;
}

export function ChatWindow({ chatId, currentUserId }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = subscribeToMessages(chatId, setMessages);
    return unsub;
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(chatId, currentUserId, text.trim());
      setText("");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.length === 0 && (
          <p className="text-sm text-slate-400 text-center pt-12">
            No hay mensajes aún. ¡Inicia la conversación!
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2 text-sm break-words",
                  isMe
                    ? "bg-[#0f172a] text-white rounded-br-sm"
                    : "bg-slate-100 text-slate-900 rounded-bl-sm"
                )}
              >
                <p>{msg.text}</p>
                <p className={cn("text-[10px] mt-1", isMe ? "text-slate-400" : "text-slate-400")}>
                  {new Date(msg.createdAt).toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="border-t border-slate-200 px-4 py-3 flex gap-2 bg-white"
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-slate-50 border-slate-200"
          disabled={sending}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!text.trim() || sending}
          className="bg-[#0f172a] text-white hover:bg-[#0b1220] shrink-0"
        >
          <Send className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </form>
    </div>
  );
}
