// ============================================================
// shared/utils/fileUrl.js
// ============================================================

/**
 * Convert multer disk path to a public URL.
 *
 * Example:
 * C:\project\uploads\VLN123\pan.jpg
 * ->
 * http://localhost:5000/uploads/VLN123/pan.jpg
 */

export const diskPathToUrl = (diskPath) => {
  if (!diskPath) return null;

  const normalizedPath = diskPath.replace(/\\/g, "/");

  const uploadsIndex = normalizedPath.indexOf("uploads/");
  if (uploadsIndex === -1) return normalizedPath;

  const relativePath = normalizedPath.slice(uploadsIndex);

  const baseUrl =
    process.env.BACKEND_URL ||
    `http://localhost:${process.env.PORT || 5000}`;

  return `${baseUrl}/${relativePath}`;
};

export default diskPathToUrl;