"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { useToast } from "@/components/ui/Toast";
import {
  getMessages,
  markMessageRead,
  deleteMessage,
} from "@/lib/firebase/firestore-services";
import { ContactMessage } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import {
  Mail,
  MailOpen,
  Trash2,
  Reply,
  Loader2,
  CheckCircle,
  Inbox,
} from "lucide-react";

export default function AdminMessagesPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      console.warn("Messages load:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleRead = async (msg: ContactMessage) => {
    const newStatus = !msg.read;
    try {
      await markMessageRead(msg.id, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: newStatus } : m))
      );
      showToast(newStatus ? "Marked as read" : "Marked as unread", "info");
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return;
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showToast("Message deleted", "info");
    } catch (err: any) {
      showToast(err.message || "Failed to delete", "error");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Messages Inbox"
        subtitle="Incoming transmissions, inquiries, and collaboration proposals"
      />

      <main className="p-6 sm:p-8 max-w-5xl w-full space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-display font-semibold text-white">
              Transmissions ({messages.length})
            </h3>
            <p className="text-xs text-white/50 font-mono">
              Saved securely via Firestore contact submissions
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-[var(--sky-primary)] animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <GlassCard className="p-12 text-center space-y-3" tilt={false}>
            <Inbox className="w-10 h-10 text-white/30 mx-auto" />
            <h4 className="text-base font-semibold text-white">Inbox Clean</h4>
            <p className="text-xs text-white/50 max-w-sm mx-auto">
              Any messages submitted from the public contact section will appear here in real time.
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <GlassCard
                key={msg.id}
                className={`p-6 space-y-4 transition-all ${
                  !msg.read
                    ? "border-[var(--sky-primary)]/40 bg-[var(--sky-primary)]/[0.03]"
                    : "border-white/10"
                }`}
                tilt={false}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleRead(msg)}
                      className={`p-2 rounded-xl glass-pill transition-colors ${
                        msg.read
                          ? "text-white/40 hover:text-white"
                          : "text-[var(--sky-primary)] bg-[var(--sky-primary)]/10"
                      }`}
                      title={msg.read ? "Mark as unread" : "Mark as read"}
                    >
                      {msg.read ? (
                        <MailOpen className="w-4 h-4" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-semibold text-white">
                          {msg.name}
                        </h4>
                        {!msg.read && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                            NEW
                          </span>
                        )}
                      </div>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs font-mono text-[var(--sky-secondary)] hover:underline"
                      >
                        {msg.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-[11px] font-mono text-white/40 mr-2">
                      {formatTimestamp(msg.createdAt)}
                    </span>

                    <a
                      href={`mailto:${msg.email}?subject=Re: Transmission Inquiry from Portfolio&body=Hi ${msg.name},%0D%0A%0D%0AThank you for reaching out regarding:%0D%0A"${encodeURIComponent(
                        msg.message.slice(0, 100)
                      )}..."`}
                      className="px-3 py-1.5 rounded-xl glass-pill hover:bg-white/10 text-xs font-mono text-white/90 flex items-center gap-1.5 transition-colors"
                      title="Reply via email"
                    >
                      <Reply className="w-3.5 h-3.5 text-[var(--sky-primary)]" />
                      <span>Reply</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDelete(msg.id)}
                      className="p-1.5 rounded-xl glass-pill hover:bg-rose-500/20 text-rose-300 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 text-sm text-white/70 whitespace-pre-line leading-relaxed font-sans">
                  {msg.message}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
