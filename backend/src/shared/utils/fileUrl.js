// backend/src/shared/utils/fileUrl.js

export function diskPathToUrl(diskPath) {
  if (!diskPath) return null;

  const normalizedPath = diskPath.replace(/\\/g, "/");

  const uploadsIndex = normalizedPath.indexOf("uploads/");
  if (uploadsIndex === -1) return normalizedPath;

  const relativePath = normalizedPath.substring(uploadsIndex);

  const backendUrl =
    process.env.BACKEND_URL ||
    process.env.SERVER_URL ||
    `http://localhost:${process.env.PORT || 5000}`;

  return `${backendUrl}/${relativePath}`;
}