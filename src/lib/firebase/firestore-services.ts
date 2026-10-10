import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./client";
import {
  ProfileData,
  EducationItem,
  CertificationItem,
  ProjectItem,
  ContactMessage,
  SiteSettings,
} from "../types";

// Collections Constants
const COLLECTIONS = {
  SETTINGS: "settings",
  PROFILE: "profile",
  EDUCATION: "education",
  CERTIFICATIONS: "certifications",
  PROJECTS: "projects",
  MESSAGES: "messages",
};

// 1. Settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, "general");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as SiteSettings;
    }
    return null;
  } catch (err) {
    console.warn("Could not fetch site settings (using defaults):", err);
    return null;
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const docRef = doc(db, COLLECTIONS.SETTINGS, "general");
  await setDoc(docRef, settings, { merge: true });
}

// 2. Profile
export async function getProfile(): Promise<ProfileData | null> {
  try {
    const docRef = doc(db, COLLECTIONS.PROFILE, "main");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as ProfileData;
    }
    return null;
  } catch (err) {
    console.warn("Could not fetch profile:", err);
    return null;
  }
}

export async function saveProfile(data: ProfileData): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PROFILE, "main");
  await setDoc(
    docRef,
    {
      ...data,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

// 3. Education
export async function getEducation(): Promise<EducationItem[]> {
  try {
    const q = query(collection(db, COLLECTIONS.EDUCATION), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as EducationItem));
  } catch (err) {
    console.warn("Could not fetch education list:", err);
    return [];
  }
}

export async function saveEducation(
  item: Omit<EducationItem, "id">,
  id?: string
): Promise<string> {
  if (id) {
    const docRef = doc(db, COLLECTIONS.EDUCATION, id);
    await setDoc(docRef, item, { merge: true });
    return id;
  } else {
    const colRef = collection(db, COLLECTIONS.EDUCATION);
    const res = await addDoc(colRef, item);
    return res.id;
  }
}

export async function deleteEducation(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.EDUCATION, id);
  await deleteDoc(docRef);
}

// 4. Certifications
export async function getCertifications(): Promise<CertificationItem[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.CERTIFICATIONS),
      orderBy("order", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CertificationItem));
  } catch (err) {
    console.warn("Could not fetch certifications:", err);
    return [];
  }
}

export async function saveCertification(
  item: Omit<CertificationItem, "id">,
  id?: string
): Promise<string> {
  if (id) {
    const docRef = doc(db, COLLECTIONS.CERTIFICATIONS, id);
    await setDoc(docRef, item, { merge: true });
    return id;
  } else {
    const colRef = collection(db, COLLECTIONS.CERTIFICATIONS);
    const res = await addDoc(colRef, item);
    return res.id;
  }
}

export async function deleteCertification(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CERTIFICATIONS, id);
  await deleteDoc(docRef);
}

// 5. Projects
export async function getProjects(): Promise<ProjectItem[]> {
  try {
    const q = query(collection(db, COLLECTIONS.PROJECTS), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectItem));
  } catch (err) {
    console.warn("Could not fetch projects:", err);
    return [];
  }
}

export async function saveProject(
  item: Omit<ProjectItem, "id">,
  id?: string
): Promise<string> {
  if (id) {
    const docRef = doc(db, COLLECTIONS.PROJECTS, id);
    await setDoc(docRef, item, { merge: true });
    return id;
  } else {
    const colRef = collection(db, COLLECTIONS.PROJECTS);
    const res = await addDoc(colRef, item);
    return res.id;
  }
}

export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PROJECTS, id);
  await deleteDoc(docRef);
}

// 6. Messages
export async function getMessages(): Promise<ContactMessage[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactMessage));
  } catch (err) {
    console.warn("Could not fetch messages:", err);
    return [];
  }
}

export async function markMessageRead(id: string, read: boolean): Promise<void> {
  const docRef = doc(db, COLLECTIONS.MESSAGES, id);
  await updateDoc(docRef, { read });
}

export async function deleteMessage(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.MESSAGES, id);
  await deleteDoc(docRef);
}

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  message: string;
}): Promise<string> {
  const colRef = collection(db, COLLECTIONS.MESSAGES);
  const res = await addDoc(colRef, {
    ...payload,
    createdAt: Date.now(),
    read: false,
    replied: false,
  });
  return res.id;
}
