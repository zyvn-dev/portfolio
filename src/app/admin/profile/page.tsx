"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/Toast";
import { getProfile, saveProfile } from "@/lib/firebase/firestore-services";
import { ProfileData } from "@/lib/types";
import { Save, Plus, Trash2, Loader2, Sparkles } from "lucide-react";

export default function AdminProfilePage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<ProfileData>({
    fullName: "",
    greetingName: "",
    headline: "",
    shortIntro: "",
    bioParagraphs: [""],
    avatarUrl: "",
    email: "",
    location: "",
    availableForHire: true,
    resumeUrl: "",
    socials: {
      github: "",
      linkedin: "",
      twitter: "",
      instagram: "",
      website: "",
    },
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getProfile();
        if (data) {
          setFormData({
            ...data,
            bioParagraphs:
              data.bioParagraphs && data.bioParagraphs.length > 0
                ? data.bioParagraphs
                : [""],
            socials: data.socials || {},
          });
        }
      } catch (err) {
        console.warn("Profile load:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleBioChange = (index: number, val: string) => {
    const updated = [...formData.bioParagraphs];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, bioParagraphs: updated }));
  };

  const addBioParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      bioParagraphs: [...prev.bioParagraphs, ""],
    }));
  };

  const removeBioParagraph = (index: number) => {
    const updated = formData.bioParagraphs.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      bioParagraphs: updated.length > 0 ? updated : [""],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Filter out empty paragraphs
      const cleanData: ProfileData = {
        ...formData,
        bioParagraphs: formData.bioParagraphs.filter((p) => p.trim().length > 0),
      };

      await saveProfile(cleanData);
      showToast("Profile updated successfully! Live on portfolio.", "success");
    } catch (err: any) {
      console.error("Save profile error:", err);
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-[var(--sky-primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Profile Identity"
        subtitle="Configure personal narrative, avatar, and communication channels"
      />

      <main className="p-6 sm:p-8 max-w-5xl w-full">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar and Basic Names */}
          <GlassCard className="p-6 sm:p-8 space-y-6" tilt={false}>
            <h3 className="text-base font-display font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--sky-primary)]" />
              <span>Core Identification</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5">
                <ImageUploader
                  label="Portrait Avatar"
                  value={formData.avatarUrl}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, avatarUrl: url }))
                  }
                  recommendedSize="800x800 square"
                  folder="portfolio/avatars"
                />
              </div>

              <div className="md:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-white/60">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Muhammad Zain Umer"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-white/60">
                      GREETING SHORT NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Zain"
                      value={formData.greetingName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          greetingName: e.target.value,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/60">
                    PROFESSIONAL HEADLINE *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Senior Product Designer & Full-Stack Architect"
                    value={formData.headline}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, headline: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/60">
                    SHORT HERO INTRO *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Crafting award-winning web products, fluid WebGL graphics, and scalable digital architectures."
                    value={formData.shortIntro}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, shortIntro: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)] resize-none"
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Narrative Bio */}
          <GlassCard className="p-6 sm:p-8 space-y-6" tilt={false}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-display font-semibold text-white">
                  Narrative Bio Paragraphs
                </h3>
                <p className="text-xs text-white/50 font-mono mt-0.5">
                  Displayed in the About Section. Add as many paragraphs as needed.
                </p>
              </div>

              <button
                type="button"
                onClick={addBioParagraph}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill hover:bg-white/10 text-xs font-mono text-white border border-white/10"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Paragraph</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.bioParagraphs.map((para, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <textarea
                    rows={3}
                    placeholder={`Paragraph ${idx + 1}...`}
                    value={para}
                    onChange={(e) => handleBioChange(idx, e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)] resize-none"
                  />
                  {formData.bioParagraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBioParagraph(idx)}
                      className="p-2.5 rounded-xl glass-pill hover:bg-rose-500/20 text-rose-300 transition-colors border border-white/5 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Contact, Location & Availability */}
          <GlassCard className="p-6 sm:p-8 space-y-6" tilt={false}>
            <h3 className="text-base font-display font-semibold text-white">
              Location, Contact & Curriculum Vitae
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white/60">
                  PUBLIC EMAIL *
                </label>
                <input
                  type="email"
                  required
                  placeholder="hello@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white/60">
                  LOCATION *
                </label>
                <input
                  type="text"
                  required
                  placeholder="San Francisco, CA / Remote"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white/60">
                  RESUME / CV URL (OPTIONAL)
                </label>
                <input
                  type="url"
                  placeholder="https://.../resume.pdf"
                  value={formData.resumeUrl || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, resumeUrl: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="availableForHire"
                checked={formData.availableForHire}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availableForHire: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded text-teal-500 bg-white/10 border-white/20 focus:ring-teal-400"
              />
              <label htmlFor="availableForHire" className="text-xs font-mono text-white/80 cursor-pointer">
                Mark as actively available for new contracts / employment
              </label>
            </div>
          </GlassCard>

          {/* Social Profiles */}
          <GlassCard className="p-6 sm:p-8 space-y-6" tilt={false}>
            <h3 className="text-base font-display font-semibold text-white">
              Social Networks
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white/60">GITHUB URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={formData.socials?.github || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socials: { ...prev.socials, github: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[var(--sky-primary)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white/60">LINKEDIN URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.socials?.linkedin || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socials: { ...prev.socials, linkedin: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[var(--sky-primary)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white/60">TWITTER / X URL</label>
                <input
                  type="url"
                  placeholder="https://x.com/..."
                  value={formData.socials?.twitter || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socials: { ...prev.socials, twitter: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[var(--sky-primary)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white/60">INSTAGRAM URL</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={formData.socials?.instagram || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socials: { ...prev.socials, instagram: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[var(--sky-primary)]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono text-white/60">PERSONAL SITE / BLOG</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.socials?.website || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socials: { ...prev.socials, website: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[var(--sky-primary)]"
                />
              </div>
            </div>
          </GlassCard>

          {/* Sticky Save Bar */}
          <div className="sticky bottom-6 z-20 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[var(--sky-secondary)] to-[var(--sky-primary)] text-slate-950 font-semibold text-sm shadow-xl shadow-[var(--sky-glow)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
