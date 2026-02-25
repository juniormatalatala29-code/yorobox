// src/utils/uploadToCloudinary.ts
export async function uploadToCloudinary(file: File) {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary env vars manquantes (VITE_CLOUDINARY_...)");
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", "salons");

  const res = await fetch(url, { method: "POST", body: form });
  if (!res.ok) throw new Error("Upload Cloudinary échoué");

  const data = await res.json();

  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
  };
}