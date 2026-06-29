/**
 * Uploads a file to Cloudinary using an unsigned upload preset.
 * 
 * @param {File} file - The file object to upload
 * @param {string} resourceType - The type of file ('image', 'video', 'raw' for documents)
 * @returns {Promise<string>} - The secure URL of the uploaded file
 */
export const uploadToCloudinary = async (file, resourceType = 'auto') => {
  // Replace these with your actual Cloudinary credentials or use environment variables
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dzx2xxx'; // Fallback dummy
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'gitm_preset'; // Fallback dummy

  if (!cloudName || !uploadPreset) {
    console.error("Cloudinary credentials are not set. Check your .env file.");
    throw new Error("Missing Cloudinary configuration.");
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url; // Return the secure HTTPS URL of the uploaded file
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
