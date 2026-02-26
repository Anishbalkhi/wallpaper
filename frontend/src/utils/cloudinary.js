
export const getOptimizedUrl = (url, width = 800) => {
  if (!url) return '';
  if (!url.includes('cloudinary.com')) return url;
  
  // Split the URL to insert transformations
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  
  return `${parts[0]}/upload/w_${width},q_auto,f_auto/${parts[1]}`;
};
