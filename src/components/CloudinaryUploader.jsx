import React, { useEffect, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const txt = (lang, en, ar, fr, zh) => lang === 'ar' ? ar : lang === 'fr' ? fr : lang === 'zh' ? zh : en;

export default function CloudinaryUploader({ onUploadSuccess, buttonText, resourceType = 'auto' }) {
  const { lang } = useLanguage();
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    // Dynamically load the Cloudinary upload widget script if not present
    if (!document.getElementById('cloudinary-widget-script')) {
      const script = document.createElement('script');
      script.id = 'cloudinary-widget-script';
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
    } else {
      initWidget();
    }

    function initWidget() {
      if (window.cloudinary) {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget(
          {
            cloudName: 'dh25r9ztp',
            uploadPreset: 'gitm_uploads', // The user must create this unsigned preset in their Cloudinary dashboard
            sources: ['local', 'url', 'camera'],
            resourceType: resourceType, // 'auto' allows images, videos, raw files
            multiple: false,
            theme: 'minimal',
            styles: {
              palette: {
                window: '#0B132B',
                sourceBg: '#1C2541',
                windowBorder: '#00E5FF',
                tabIcon: '#00E5FF',
                inactiveTabIcon: '#697B9C',
                menuIcons: '#00FF87',
                link: '#00E5FF',
                action: '#00E5FF',
                inProgress: '#00FF87',
                complete: '#00FF87',
                error: '#FF4D4D',
                textDark: '#FFFFFF',
                textLight: '#0B132B'
              }
            }
          },
          (error, result) => {
            if (!error && result && result.event === 'success') {
              console.log('Upload successful! Info: ', result.info);
              if (onUploadSuccess) {
                onUploadSuccess(result.info);
              }
            }
          }
        );
      }
    }
  }, [resourceType, onUploadSuccess]);

  return (
    <button 
      onClick={() => widgetRef.current?.open()}
      className="btn-primary w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
    >
      <UploadCloud size={20} />
      {buttonText || txt(lang, 'Upload Media', 'رفع وسائط', 'Télécharger', '上传')}
    </button>
  );
}
