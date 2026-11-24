import { uploadToCloudinary } from './cloudinary.js';

/**
 * Uploads project files and resolves attachments with real URLs.
 * If cover image is absent, uses the first uploaded image URL.
 *
 * @param {Object} options
 * @param {File[]} options.files - List of files to upload
 * @param {string} [options.currentCoverImage] - Existing cover image URL if present
 * @param {Function} [options.uploader] - Cloudinary uploader function (defaults to uploadToCloudinary)
 * @returns {Promise<{ attachments: Array<{ name: string, url: string, size: string, type: string }>, coverImage: string }>}
 */
export async function uploadProjectFiles({
  files = [],
  currentCoverImage = '',
  uploader = uploadToCloudinary,
} = {}) {
  const attachments = [];
  let resolvedCover = (currentCoverImage || '').trim();

  for (const file of files) {
    const isImage = Boolean(file.type && file.type.startsWith('image/'));
    const resourceType = isImage ? 'image' : 'auto';
    const url = await uploader(file, resourceType);

    if (!url || typeof url !== 'string') {
      throw new Error(`Upload failed for ${file.name || 'file'}: invalid URL returned`);
    }

    attachments.push({
      name: file.name || 'attachment',
      url,
      size: typeof file.size === 'number' ? `${(file.size / 1024).toFixed(1)} KB` : (file.size || '0 KB'),
      type: file.type || 'application/octet-stream',
    });

    if (!resolvedCover && isImage && url) {
      resolvedCover = url;
    }
  }

  return {
    attachments,
    coverImage: resolvedCover,
  };
}

/**
 * Retains user cover edits made during asynchronous upload;
 * replaces starting cover if unchanged.
 *
 * @param {string} prevCover - The current cover image state at commit time
 * @param {string} startingCover - The cover image state captured when upload started
 * @param {string} newCover - The uploaded cover candidate
 * @returns {string} - The resolved cover image URL
 */
export function applyCoverIfUnchanged(prevCover, startingCover, newCover) {
  if (prevCover !== startingCover) {
    return prevCover;
  }
  return newCover;
}
