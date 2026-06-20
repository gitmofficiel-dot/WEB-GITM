import { Cloudinary } from '@cloudinary/url-gen';

export const cld = new Cloudinary({
  cloud: {
    cloudName: 'dh25r9ztp',
    apiKey: '781516539332848'
  }
});

// Helper function to get an optimized image URL
export const getOptimizedImage = (publicId) => {
  return cld.image(publicId)
    .format('auto')
    .quality('auto');
};
