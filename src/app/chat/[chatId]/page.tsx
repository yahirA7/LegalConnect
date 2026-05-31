"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MainNav } from "@/components/nav/MainNav";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useAuth } from "@/components/providers/AuthProvider";
import { markChatAsRead } from "@/lib/firestore";
import type { Chat } from "@/lib/types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [chat, setChat] = useState<Chat | null>(null);
  const [chatLoading, setChatLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!db || !chatId) return;
    getDoc(doc(db, "chats", chatId)).then((snap) => {
      if (snap.exists()) setChat({ id: snap.id, ...snap.data() } as Chat);
      setChatLoading(false);
    });
  }, [chatId]);

  useEffect(() => {
    if (!user || !chatId) return;
    markChatAsRead(chatId, user.uid);
  }, [chatId, user]);

  if (loading || chatLoading || !profile || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <MainNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-5 w-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <MainNav />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-slate-500">Conversación no encontrada.</p>
          <Link href="/chat" className="text-sm text-slate-700 underline">Volver a mensajes</Link>
        </div>
      </div>
    );
  }

  const isClient = profile.role === "cliente";
  const otherName = isClient ? chat.lawyerName : chat.clientName;
  const otherPhoto = isClient ? chat.lawyerPhoto : chat.clientPhoto;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <MainNav />
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white sticky top-[4.5rem] z-10">
          <Link href="/chat" className="text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <ProfileAvatar src={otherPhoto} alt={otherName} size="sm" />
          <div>
            <p className="font-medium text-slate-900 text-sm">{otherName}</p>
            <p className="text-xs text-slate-400">{isClient ? "Abogado" : "Cliente"}</p>
          </div>
        </div>

        <div className="flex-1 bg-white border-x border-slate-200" style={{ minHeight: 0, height: "calc(100vh - 10rem)" }}>
          <ChatWindow chatId={chatId} currentUserId={user.uid} />
        </div>
      </div>
    </div>
  );
}
