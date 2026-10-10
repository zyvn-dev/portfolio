"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/Toast";
import { getSiteSettings, saveSiteSettings } from "@/lib/firebase/firestore-services";
import { SiteSettings } from "@/lib/types";
import { Save, Loader2, Sliders, Globe, Eye, Sparkles } from "lucide-react";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<SiteSettings>({
    siteTitle: "The Living Sky — Personal Portfolio",
    seoDescription:
      "An award-level personal portfolio template reacting dynamically to visitor local time.",
    keywords: ["Portfolio", "Creative Developer", "Next.js", "WebGL"],
    ogImage: "",
    faviconUrl: "",
    visibility: {
      hero: true,
      about: true,
      education: true,
      certifications: true,
      projects: true,
      contact: true,
    },
    themeMode: "auto",
  });

  const [keywordsInput, setKeywordsInput] = useState(
    "Portfolio, Creative Developer, Next.js, WebGL"
  );

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        if (data) {
          setFormData(data);
          setKeywordsInput(data.keywords?.join(", ") || "");
        }
      } catch (err) {
        console.warn("Settings load:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleToggleSection = (section: keyof typeof formData.visibility) => {
    setFormData((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [section]: !prev.visibility[section],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const keywords = keywordsInput
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const payload = {
        ...formData,
        keywords,
      };

      await saveSiteSettings(payload);
      showToast("Settings updated successfully! Live on portfolio.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update settings", "error");
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
        title="Site Settings & Visibility"
        subtitle="Configure SEO metadata, OpenGraph preview, and section display toggles"
      />

      <main className="p-6 sm:p-8 max-w-5xl w-full">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SEO & Meta */}
          <GlassCard className="p-6 sm:p-8 space-y-6" tilt={false}>
            <h3 className="text-base font-display font-semibold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--sky-primary)]" />
              <span>Metadata & Search Optimization</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white/60">
                  SITE TITLE (BROWSER TAB & OG) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.siteTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, siteTitle: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white/60">
                  SEO DESCRIPTION (SEARCH SNIPPET & TWITTER CARD) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.seoDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      seoDescription: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white/60">
                  SEARCH KEYWORDS (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-[var(--sky-primary)]"
                />
              </div>

              <ImageUploader
                label="OpenGraph Social Banner Image (OG Image)"
                value={formData.ogImage || ""}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, ogImage: url }))
                }
                recommendedSize="1200x630 (1.91:1 ratio)"
                folder="portfolio/seo"
              />
            </div>
          </GlassCard>

          {/* Section Visibility Toggles */}
          <GlassCard className="p-6 sm:p-8 space-y-6" tilt={false}>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[var(--sky-secondary)]" />
              <h3 className="text-base font-display font-semibold text-white">
                Public Section Visibility
              </h3>
            </div>
            <p className="text-xs text-white/50 font-mono -mt-4">
              Toggle visibility for individual sections on your live landing page
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              {(
                [
                  { key: "hero", label: "Hero Greeting & Intro" },
                  { key: "about", label: "About Narrative" },
                  { key: "education", label: "Education Timeline" },
                  { key: "certifications", label: "Certifications Grid" },
                  { key: "projects", label: "Projects Bento" },
                  { key: "contact", label: "Contact Form" },
                ] as const
              ).map((sec) => (
                <div
                  key={sec.key}
                  onClick={() => handleToggleSection(sec.key)}
                  className={`p-4 rounded-2xl glass-pill cursor-pointer border transition-all flex items-center justify-between ${
                    formData.visibility[sec.key]
                      ? "border-[var(--sky-primary)]/40 bg-[var(--sky-primary)]/[0.05]"
                      : "border-white/10 opacity-50"
                  }`}
                >
                  <span className="text-xs font-medium text-white">
                    {sec.label}
                  </span>
                  <div
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                      formData.visibility[sec.key]
                        ? "bg-[var(--sky-primary)]"
                        : "bg-white/20"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                        formData.visibility[sec.key] ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
              ))}
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
                  <span>Saving Settings...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
