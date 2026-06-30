import React, { useCallback, useState } from 'react';
import { UploadCloud, X, Image as ImageIcon, FileVideo, FileText, Loader2 } from 'lucide-react';
import { useMediaUpload } from '../../hooks/useMediaUpload';

const MediaUploader = ({ onUploadSuccess, resourceType = 'auto', multiple = false, maxFiles = 10 }) => {
  const { uploadSingle, uploadMultiple, uploading, progress, error, uploadedUrls } = useMediaUpload();
  const [dragActive, setDragActive] = useState(false);
  const [localFiles, setLocalFiles] = useState([]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files) => {
    const filesToUpload = multiple ? files.slice(0, maxFiles) : [files[0]];
    setLocalFiles(filesToUpload);
    
    try {
      if (multiple) {
        const urls = await uploadMultiple(filesToUpload, resourceType);
        if (onUploadSuccess) onUploadSuccess(urls);
      } else {
        const url = await uploadSingle(filesToUpload[0], resourceType);
        if (onUploadSuccess) onUploadSuccess(url);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...localFiles];
    newFiles.splice(index, 1);
    setLocalFiles(newFiles);
    // Note: We don't delete from Cloudinary here to keep it simple, 
    // but in a real app we might want to clean up orphaned files.
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 ${
          dragActive 
            ? 'border-cyan-500 bg-cyan-500/10' 
            : 'border-gray-500/30 hover:border-cyan-500/50 hover:bg-white/5'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          multiple={multiple} 
          onChange={handleChange} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={resourceType === 'image' ? 'image/*' : resourceType === 'video' ? 'video/*' : '*/*'}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
            <p className="text-sm text-gray-400">Uploading... {progress}%</p>
            <div className="w-full max-w-xs h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg font-semibold text-gray-200">Drag & Drop files here</p>
            <p className="text-sm text-gray-500 mt-2">or click to browse</p>
          </>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

      {/* Previews */}
      {uploadedUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedUrls.map((url, idx) => (
            <div key={idx} className="relative group rounded-lg overflow-hidden glass-card p-1">
              {url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                <img src={url} alt="upload" className="w-full h-24 object-cover rounded" />
              ) : url.match(/\.(mp4|webm|ogg)$/i) ? (
                <video src={url} className="w-full h-24 object-cover rounded" />
              ) : (
                <div className="w-full h-24 flex flex-col items-center justify-center bg-black/20 rounded">
                  <FileText className="w-8 h-8 text-cyan-500" />
                  <span className="text-xs mt-1 truncate w-full text-center px-2">{localFiles[idx]?.name || 'Document'}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    removeFile(idx);
                  }}
                  className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
