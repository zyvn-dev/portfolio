"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";
import {
  getProfile,
  getEducation,
  getCertifications,
  getProjects,
  getSiteSettings,
} from "@/lib/firebase/firestore-services";
import {
  ProfileData,
  EducationItem,
  CertificationItem,
  ProjectItem,
  SiteSettings,
} from "@/lib/types";

export default function HomePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPortfolioData() {
      try {
        const [profData, eduData, certData, projData, settData] = await Promise.all([
          getProfile(),
          getEducation(),
          getCertifications(),
          getProjects(),
          getSiteSettings(),
        ]);

        if (isMounted) {
          setProfile(profData);
          setEducation(eduData);
          setCertifications(certData);
          setProjects(projData);
          setSettings(settData);
          setIsLoading(false);
        }
      } catch (err) {
        console.warn("Notice: Firestore initial load warning:", err);
        if (isMounted) setIsLoading(false);
      }
    }

    loadPortfolioData();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibility = settings?.visibility || {
    hero: true,
    about: true,
    education: true,
    certifications: true,
    projects: true,
    contact: true,
  };

  return (
    <main className="flex-1 flex flex-col">
      <Navbar />

      {visibility.hero && <HeroSection profile={profile} />}
      {visibility.about && <AboutSection profile={profile} />}
      {visibility.education && <EducationSection education={education} />}
      {visibility.certifications && (
        <CertificationsSection certifications={certifications} />
      )}
      {visibility.projects && <ProjectsSection projects={projects} />}
      {visibility.contact && <ContactSection />}

      <Footer profile={profile} />
    </main>
  );
}
