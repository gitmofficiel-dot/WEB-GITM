import { useState, useCallback } from 'react';
import { uploadToCloudinary } from '../utils/cloudinary';

/**
 * Hook for handling media uploads (images, videos, documents)
 */
export const useMediaUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // Optional: if we want to simulate progress or use XHR
  const [error, setError] = useState(null);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const uploadSingle = useCallback(async (file, resourceType = 'auto') => {
    setUploading(true);
    setError(null);
    setProgress(0);
    try {
      // We simulate progress for better UX since fetch doesn't natively support upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 300);

      const url = await uploadToCloudinary(file, resourceType);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setUploadedUrls(prev => [...prev, url]);
      return url;
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message);
      throw err;
    } finally {
      setTimeout(() => setUploading(false), 500); // Give time for 100% to show
    }
  }, []);

  const uploadMultiple = useCallback(async (files, resourceType = 'auto') => {
    setUploading(true);
    setError(null);
    setProgress(0);
    const urls = [];
    
    try {
      const totalFiles = files.length;
      for (let i = 0; i < totalFiles; i++) {
        const url = await uploadToCloudinary(files[i], resourceType);
        urls.push(url);
        setProgress(Math.round(((i + 1) / totalFiles) * 100));
      }
      setUploadedUrls(prev => [...prev, ...urls]);
      return urls;
    } catch (err) {
      console.error('Bulk upload failed:', err);
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setUploadedUrls([]);
    setProgress(0);
    setError(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadedUrls,
    uploadSingle,
    uploadMultiple,
    reset
  };
};
