"use client";

import { useState, useEffect } from "react";
import { subscribeToChats } from "@/lib/firestore";
import type { Chat } from "@/lib/types";

/** Devuelve el número de chats con mensajes no leídos para el usuario. */
export function useUnreadChats(uid: string | undefined, role: "cliente" | "abogado" | undefined) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!uid || !role) return;
    const unsub = subscribeToChats(uid, role, (chats: Chat[]) => {
      const count = chats.filter((chat) => {
        if (!chat.lastMessageAt) return false;
        if (chat.lastSenderId === uid) return false; // yo lo envié, no es no leído
        const lastRead: string | undefined = chat[`lastRead_${uid}`];
        return !lastRead || chat.lastMessageAt > lastRead;
      }).length;
      setUnread(count);
    });
    return unsub;
  }, [uid, role]);

  return unread;
}
