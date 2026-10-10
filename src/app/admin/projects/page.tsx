"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/Toast";
import {
  getProjects,
  saveProject,
  deleteProject,
} from "@/lib/firebase/firestore-services";
import { ProjectItem, ProjectLink } from "@/lib/types";
import {
  Plus,
  Edit2,
  Trash2,
  FolderGit2,
  ExternalLink,
  X,
  Loader2,
  Star,
  Link as LinkIcon,
} from "lucide-react";
import Image from "next/image";

export default function AdminProjectsPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<ProjectItem, "id">>({
    title: "",
    summary: "",
    fullDescription: "",
    coverImageUrl: "",
    tags: [],
    links: [{ label: "GitHub", url: "" }],
    featured: false,
    order: 0,
  });

  const [tagInput, setTagInput] = useState("");

  const loadData = async () => {
    try {
      const data = await getProjects();
      setItems(data);
    } catch (err) {
      console.warn("Projects load:", err);
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
      summary: "",
      fullDescription: "",
      coverImageUrl: "",
      tags: [],
      links: [
        { label: "Live Demo", url: "" },
        { label: "GitHub", url: "" },
      ],
      featured: false,
      order: items.length,
    });
    setTagInput("");
    setModalOpen(true);
  };

  const openEditModal = (item: ProjectItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      summary: item.summary,
      fullDescription: item.fullDescription || item.summary,
      coverImageUrl: item.coverImageUrl || "",
      tags: item.tags || [],
      links:
        item.links && item.links.length > 0
          ? item.links
          : [{ label: "Live Demo", url: "" }],
      featured: item.featured ?? false,
      order: item.order ?? 0,
    });
    setTagInput(item.tags?.join(", ") || "");
    setModalOpen(true);
  };

  const handleLinkChange = (index: number, field: keyof ProjectLink, val: string) => {
    const updated = [...formData.links];
    updated[index] = { ...updated[index], [field]: val };
    setFormData((prev) => ({ ...prev, links: updated }));
  };

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { label: "Website", url: "" }],
    }));
  };

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      showToast("Project deleted", "info");
      loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to delete", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Process tags
      const tags = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      // Clean links
      const links = formData.links.filter((l) => l.url.trim().length > 0);

      const payload = {
        ...formData,
        tags,
        links,
      };

      await saveProject(payload, editingId || undefined);
      showToast(editingId ? "Project updated" : "Project added", "success");
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
        title="Projects & Bento Showcase"
        subtitle="Manage featured works, interactive case studies, and external deployments"
      />

      <main className="p-6 sm:p-8 max-w-5xl w-full space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-display font-semibold text-white">
              Published Works ({items.length})
            </h3>
            <p className="text-xs text-white/50 font-mono">
              Displayed in dynamic bento grid with modal view on the public site
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 rounded-full bg-[var(--sky-primary)] text-slate-950 font-semibold text-xs font-mono flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-teal-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-[var(--sky-primary)] animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <GlassCard className="p-12 text-center space-y-3" tilt={false}>
            <FolderGit2 className="w-10 h-10 text-white/30 mx-auto" />
            <h4 className="text-base font-semibold text-white">No Projects Published</h4>
            <p className="text-xs text-white/50 max-w-sm mx-auto">
              Add your applications or case studies. When zero projects exist, an elegant empty state renders on the public site.
            </p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <GlassCard key={item.id} className="p-5 flex flex-col justify-between" tilt={false}>
                <div className="space-y-4">
                  <div className="relative w-full h-44 rounded-xl overflow-hidden glass-pill border border-white/10">
                    {item.coverImageUrl ? (
                      <Image
                        src={item.coverImageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30">
                        <FolderGit2 className="w-8 h-8" />
                      </div>
                    )}
                    {item.featured && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/80 text-black font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-base font-display font-semibold text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-white/60 line-clamp-2 mt-1">
                      {item.summary}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {item.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 text-[var(--sky-secondary)] border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                  <span className="text-[11px] font-mono text-white/40">
                    {item.links?.length || 0} Links
                  </span>

                  <div className="flex items-center gap-1.5">
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
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
            <GlassCard className="max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto border-white/20" tilt={false}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold text-white">
                  {editingId ? "Edit Project Case Study" : "Add Project Case Study"}
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
                    PROJECT TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="OmniFlow — Autonomous Agent Engine"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/60">
                    OVERVIEW SUMMARY (SHORT BENTO CARD BLURB) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Real-time distributed agent framework powered by WebSockets and Next.js."
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, summary: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/60">
                    FULL ARCHITECTURAL DETAILS (MODAL SCOPE) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Detailed explanation of the problem, tech stack, architecture decisions, and results..."
                    value={formData.fullDescription}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullDescription: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)] resize-none"
                  />
                </div>

                <ImageUploader
                  label="Cover Image"
                  value={formData.coverImageUrl}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, coverImageUrl: url }))
                  }
                  recommendedSize="1200x800 banner"
                  folder="portfolio/projects"
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/60">
                    TAGS (COMMA SEPARATED)
                  </label>
                  <input
                    type="text"
                    placeholder="Next.js, TypeScript, Three.js, WebGL, AI"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                  />
                </div>

                {/* Dynamic Links List */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-white/60 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-[var(--sky-primary)]" />
                      <span>EXTERNAL LINKS (GITHUB, VERCEL, LIVE DEMO)</span>
                    </label>
                    <button
                      type="button"
                      onClick={addLink}
                      className="text-xs font-mono text-[var(--sky-secondary)] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Link</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.links.map((link, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Label (e.g. GitHub)"
                          value={link.label}
                          onChange={(e) =>
                            handleLinkChange(idx, "label", e.target.value)
                          }
                          className="w-32 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[var(--sky-primary)]"
                        />
                        <input
                          type="url"
                          placeholder="https://github.com/..."
                          value={link.url}
                          onChange={(e) =>
                            handleLinkChange(idx, "url", e.target.value)
                          }
                          className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[var(--sky-primary)]"
                        />
                        <button
                          type="button"
                          onClick={() => removeLink(idx)}
                          className="p-2 rounded-xl glass-pill hover:bg-rose-500/20 text-rose-300 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featuredSwitch"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          featured: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded text-teal-500 bg-white/10 border-white/20 focus:ring-teal-400"
                    />
                    <label htmlFor="featuredSwitch" className="text-xs font-mono text-white/80 cursor-pointer">
                      Featured Bento Hero (2 columns)
                    </label>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <label className="text-xs font-mono text-white/60">ORDER:</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          order: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-20 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[var(--sky-primary)]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
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
                    className="px-6 py-2.5 rounded-full bg-[var(--sky-primary)] text-slate-950 font-semibold text-xs font-mono flex items-center gap-2 hover:brightness-110 disabled:opacity-50"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Project</span>
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
