"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import type { NotificationData } from "@/types/notification";

interface NotificationContextValue {
  notifications: NotificationData[];
  unreadCount: number;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  addNotification: (notification: NotificationData) => void;
  onNewNotification: ((notification: NotificationData) => void) | null;
  setOnNewNotification: (cb: ((notification: NotificationData) => void) | null) => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  markRead: async () => {},
  markAllRead: async () => {},
  addNotification: () => {},
  onNewNotification: null,
  setOnNewNotification: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [onNewNotification, setOnNewNotification] = useState<((notification: NotificationData) => void) | null>(null);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const pollRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const fetchNotifications = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data: NotificationData[] = await res.json();
        setNotifications(data);

        // Detect newly arrived notifications
        for (const n of data) {
          if (!knownIdsRef.current.has(n.id)) {
            knownIdsRef.current.add(n.id);
            if (knownIdsRef.current.size > 1 && onNewNotification) {
              onNewNotification(n);
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }, [session?.user?.id, onNewNotification]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Poll every 3 seconds
  useEffect(() => {
    const poll = () => {
      pollRef.current = setTimeout(() => {
        fetchNotifications();
        poll();
      }, 3000);
    };
    poll();
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [fetchNotifications]);

  const markRead = useCallback(async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      );
    } catch {
      // ignore
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
      );
    } catch {
      // ignore
    }
  }, []);

  const addNotification = useCallback((notification: NotificationData) => {
    setNotifications((prev) => [notification, ...prev]);
    knownIdsRef.current.add(notification.id);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markRead,
        markAllRead,
        addNotification,
        onNewNotification,
        setOnNewNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
