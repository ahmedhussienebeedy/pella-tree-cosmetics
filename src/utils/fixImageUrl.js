/**
 * Utility to fix Firebase Storage image URLs
 * Converts any storage URL or path to a direct media link
 */
export function fixImageUrl(url) {
  if (!url) return "";

  // لو الرابط فعلاً direct URL مع alt=media خلاص
  if (url.includes("alt=media")) return url;

  // لو الرابط عبارة عن path من database
  if (url.includes("name=")) {
    const namePart = url.split("name=")[1];
    return `https://firebasestorage.googleapis.com/v0/b/pellatree-ec60b.appspot.com/o/${namePart}&alt=media`;
  }

  // لو مجرد path عادي
  if (url.startsWith("products/")) {
    return `https://firebasestorage.googleapis.com/v0/b/pellatree-ec60b.appspot.com/o/${encodeURIComponent(url)}?alt=media`;
  }

  return url; // fallback
}
