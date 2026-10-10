import * as admin from "firebase-admin";

const ADMIN_EMAIL = "muhammmadzainumer@gmail.com";

function getFirebaseAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  if (clientEmail && privateKey && projectId) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  // Fallback to default application credentials if running in GCP/Vercel with ADC
  return admin.initializeApp({
    projectId: projectId || "living-sky-portfolio",
  });
}

export const adminApp = getFirebaseAdminApp();
export const adminAuth = admin.auth(adminApp);
export const adminDb = admin.firestore(adminApp);

export async function verifyAdminToken(idToken: string): Promise<boolean> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return (
      !!decodedToken.email &&
      decodedToken.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      !!decodedToken.email_verified
    );
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
}
