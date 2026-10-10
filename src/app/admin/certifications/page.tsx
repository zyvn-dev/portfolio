"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/Toast";
import {
  getCertifications,
  saveCertification,
  deleteCertification,
} from "@/lib/firebase/firestore-services";
import { CertificationItem } from "@/lib/types";
import {
  Plus,
  Edit2,
  Trash2,
  Award,
  ExternalLink,
  X,
  Loader2,
} from "lucide-react";
import Image from "next/image";

export default function AdminCertificationsPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<CertificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<CertificationItem, "id">>({
    title: "",
    issuingOrganization: "",
    issueYear: "",
    credentialUrl: "",
    badgeImageUrl: "",
    order: 0,
  });

  const loadData = async () => {
    try {
      const data = await getCertifications();
      setItems(data);
    } catch (err) {
      console.warn("Certifications load:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: "",
      issuingOrganization: "",
      issueYear: "",
      credentialUrl: "",
      badgeImageUrl: "",
      order: items.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: CertificationItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      issuingOrganization: item.issuingOrganization,
      issueYear: item.issueYear,
      credentialUrl: item.credentialUrl || "",
      badgeImageUrl: item.badgeImageUrl || "",
      order: item.order ?? 0,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    try {
      await deleteCertification(id);
      showToast("Certification deleted", "info");
      loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to delete", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await saveCertification(formData, editingId || undefined);
      showToast(
        editingId ? "Certification updated" : "Certification added",
        "success"
      );
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Certifications & Licenses"
        subtitle="Manage verified licenses, accreditations, and badge imagery"
      />

      <main className="p-6 sm:p-8 max-w-5xl w-full space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-display font-semibold text-white">
              Credentials ({items.length})
            </h3>
            <p className="text-xs text-white/50 font-mono">
              Displayed in grid with 3D hover tilt on the public page
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 rounded-full bg-[var(--sky-accent)] text-white font-semibold text-xs font-mono flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-purple-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Certification</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-[var(--sky-primary)] animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <GlassCard className="p-12 text-center space-y-3" tilt={false}>
            <Award className="w-10 h-10 text-white/30 mx-auto" />
            <h4 className="text-base font-semibold text-white">
              No Certifications Listed
            </h4>
            <p className="text-xs text-white/50 max-w-sm mx-auto">
              Add cloud certifications or technical diplomas. Empty collections render clean placeholders on the public site.
            </p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <GlassCard
                key={item.id}
                className="p-5 flex items-start justify-between gap-4"
                tilt={false}
              >
                <div className="flex items-start gap-3.5">
                  {item.badgeImageUrl ? (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden glass-pill border border-white/10 shrink-0">
                      <Image
                        src={item.badgeImageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl glass-pill flex items-center justify-center border border-white/10 text-[var(--sky-accent)] shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold text-white leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[var(--sky-accent)] font-mono mt-0.5">
                      {item.issuingOrganization} ({item.issueYear})
                    </p>
                    {item.credentialUrl && (
                      <a
                        href={item.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-white/40 hover:text-white font-mono flex items-center gap-1 mt-1.5"
                      >
                        <span>Credential URL</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-xl glass-pill hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl glass-pill hover:bg-rose-500/20 text-rose-300 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
            <GlassCard className="max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border-white/20" tilt={false}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold text-white">
                  {editingId ? "Edit Certification" : "Add Certification"}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-full glass-pill text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/60">
                    CERTIFICATION TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="AWS Certified Solutions Architect — Associate"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-white/60">
                      ISSUING ORGANIZATION *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Amazon Web Services"
                      value={formData.issuingOrganization}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          issuingOrganization: e.target.value,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-white/60">
                      ISSUE YEAR *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="2024"
                      value={formData.issueYear}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          issueYear: e.target.value,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/60">
                    VERIFICATION LINK (OPTIONAL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://credly.com/badges/..."
                    value={formData.credentialUrl || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        credentialUrl: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                  />
                </div>

                <ImageUploader
                  label="Badge Image (Optional)"
                  value={formData.badgeImageUrl || ""}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, badgeImageUrl: url }))
                  }
                  recommendedSize="300x300 square"
                  folder="portfolio/certifications"
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/60">
                    DISPLAY ORDER
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-full glass-pill hover:bg-white/10 text-xs font-mono text-white/70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-full bg-[var(--sky-accent)] text-white font-semibold text-xs font-mono flex items-center gap-2 hover:brightness-110 disabled:opacity-50"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Certification</span>
                  </button>
                </div>
              </form>
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  );
}
