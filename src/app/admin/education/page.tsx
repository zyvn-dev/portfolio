"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/Toast";
import {
  getEducation,
  saveEducation,
  deleteEducation,
} from "@/lib/firebase/firestore-services";
import { EducationItem } from "@/lib/types";
import {
  Plus,
  Edit2,
  Trash2,
  GraduationCap,
  Building2,
  Calendar,
  X,
  Save,
  Loader2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Image from "next/image";

export default function AdminEducationPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<EducationItem, "id">>({
    institution: "",
    degreeLevel: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
    logoUrl: "",
    description: "",
    order: 0,
  });

  const loadData = async () => {
    try {
      const data = await getEducation();
      setItems(data);
    } catch (err) {
      console.warn("Education load:", err);
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
      institution: "",
      degreeLevel: "",
      fieldOfStudy: "",
      startYear: "",
      endYear: "",
      logoUrl: "",
      description: "",
      order: items.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: EducationItem) => {
    setEditingId(item.id);
    setFormData({
      institution: item.institution,
      degreeLevel: item.degreeLevel,
      fieldOfStudy: item.fieldOfStudy || "",
      startYear: item.startYear,
      endYear: item.endYear,
      logoUrl: item.logoUrl || "",
      description: item.description || "",
      order: item.order ?? 0,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    try {
      await deleteEducation(id);
      showToast("Education entry removed", "info");
      loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to delete", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await saveEducation(formData, editingId || undefined);
      showToast(
        editingId ? "Education entry updated" : "Education entry added",
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
        title="Education & Academia"
        subtitle="Manage degrees, institutions, study intervals, and logos"
      />

      <main className="p-6 sm:p-8 max-w-5xl w-full space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-display font-semibold text-white">
              Academic Milestones ({items.length})
            </h3>
            <p className="text-xs text-white/50 font-mono">
              Displayed in chronological timeline on the public page
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 rounded-full bg-[var(--sky-secondary)] text-slate-950 font-semibold text-xs font-mono flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Education</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-[var(--sky-primary)] animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <GlassCard className="p-12 text-center space-y-3" tilt={false}>
            <GraduationCap className="w-10 h-10 text-white/30 mx-auto" />
            <h4 className="text-base font-semibold text-white">No Education Listed</h4>
            <p className="text-xs text-white/50 max-w-sm mx-auto">
              Add your university or degrees. If left empty, a polished placeholder skeleton renders on the public site.
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <GlassCard
                key={item.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                tilt={false}
              >
                <div className="flex items-center gap-4">
                  {item.logoUrl ? (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden glass-pill border border-white/10 shrink-0">
                      <Image
                        src={item.logoUrl}
                        alt={item.institution}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl glass-pill flex items-center justify-center border border-white/10 text-[var(--sky-secondary)] shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                  )}

                  <div>
                    <h4 className="text-base font-display font-semibold text-white">
                      {item.institution}
                    </h4>
                    <p className="text-xs text-[var(--sky-secondary)] font-mono">
                      {item.degreeLevel} {item.fieldOfStudy ? `• ${item.fieldOfStudy}` : ""}
                    </p>
                    <span className="text-[11px] text-white/40 font-mono block mt-1">
                      {item.startYear} – {item.endYear} (Order: {item.order})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
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

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
            <GlassCard className="max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border-white/20" tilt={false}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold text-white">
                  {editingId ? "Edit Education Record" : "Add Education Record"}
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
                    INSTITUTION / UNIVERSITY *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Stanford University"
                    value={formData.institution}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        institution: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-white/60">
                      DEGREE LEVEL *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Bachelor of Science"
                      value={formData.degreeLevel}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          degreeLevel: e.target.value,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-white/60">
                      FIELD OF STUDY
                    </label>
                    <input
                      type="text"
                      placeholder="Computer Science"
                      value={formData.fieldOfStudy}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          fieldOfStudy: e.target.value,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-white/60">
                      START YEAR *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="2020"
                      value={formData.startYear}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          startYear: e.target.value,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-white/60">
                      END YEAR *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="2024 or Present"
                      value={formData.endYear}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endYear: e.target.value,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                    />
                  </div>

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
                </div>

                <ImageUploader
                  label="Institute Logo (Optional)"
                  value={formData.logoUrl || ""}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, logoUrl: url }))
                  }
                  recommendedSize="300x300 square"
                  folder="portfolio/education"
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/60">
                    DESCRIPTION (OPTIONAL)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Key highlights, honors, or thesis focus..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)] resize-none"
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
                    className="px-6 py-2.5 rounded-full bg-[var(--sky-secondary)] text-slate-950 font-semibold text-xs font-mono flex items-center gap-2 hover:brightness-110 disabled:opacity-50"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Milestone</span>
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
