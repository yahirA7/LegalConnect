"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { MainNav } from "@/components/nav/MainNav";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { useAuth } from "@/components/providers/AuthProvider";
import { subscribeToChats } from "@/lib/firestore";
import type { Chat } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ChatsPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !profile) return;
    const unsub = subscribeToChats(user.uid, profile.role, setChats);
    return unsub;
  }, [user, profile]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <MainNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-5 w-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      </div>
    );
  }

  const isClient = profile.role === "cliente";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <MainNav />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="font-display text-2xl font-semibold text-slate-900 mb-6">Mensajes</h1>

        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
            <MessageSquare className="h-10 w-10" strokeWidth={1.5} />
            <p className="text-sm">No tienes conversaciones todavía.</p>
            {isClient && (
              <Link href="/buscar" className="text-sm text-slate-700 underline">
                Busca un abogado para iniciar un chat
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {chats.map((chat) => {
              const otherName = isClient ? chat.lawyerName : chat.clientName;
              const otherPhoto = isClient ? chat.lawyerPhoto : chat.clientPhoto;
              return (
                <Link key={chat.id} href={`/chat/${chat.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <ProfileAvatar src={otherPhoto} alt={otherName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 truncate">{otherName}</p>
                    <p className={cn("text-sm truncate", chat.lastMessage ? "text-slate-500" : "text-slate-400")}>
                      {chat.lastMessage ?? "Sin mensajes aún"}
                    </p>
                  </div>
                  {chat.lastMessageAt && (
                    <span className="text-xs text-slate-400 shrink-0">
                      {new Date(chat.lastMessageAt).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
