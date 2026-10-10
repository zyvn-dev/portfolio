import { auth } from "./firebase/client";

/**
 * Compresses an image file in-browser to WebP format before uploading.
 * Keeps aspect ratio with a max dimension of 1920px.
 */
export async function compressImageToWebP(
  file: File,
  quality: number = 0.82,
  maxWidth: number = 1920,
  maxHeight: number = 1920
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = height;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to create canvas 2D context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Image compression failed"));
            }
          },
          "image/webp",
          quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load image for compression"));
    };

    reader.onerror = () => reject(new Error("Failed to read image file"));
  });
}

/**
 * Uploads an image to Cloudinary using signed authentication verified by Firebase ID token.
 */
export async function uploadImageToCloudinary(
  file: File,
  folder: string = "portfolio"
): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Admin authentication required to upload assets");
  }

  // Get Firebase ID token
  const idToken = await currentUser.getIdToken();

  // 1. Compress image to WebP
  const compressedBlob = await compressImageToWebP(file);

  // 2. Request signature from server route
  const signResponse = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ folder }),
  });

  if (!signResponse.ok) {
    const err = await signResponse.json();
    throw new Error(err.message || "Failed to obtain upload authorization");
  }

  const { signature, timestamp, apiKey, cloudName } = await signResponse.json();

  // 3. Upload directly to Cloudinary
  const formData = new FormData();
  formData.append("file", compressedBlob, `${file.name.replace(/\.[^/.]+$/, "")}.webp`);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!uploadResponse.ok) {
    const err = await uploadResponse.json();
    throw new Error(err.error?.message || "Cloudinary upload failed");
  }

  const result = await uploadResponse.json();
  return result.secure_url;
}
