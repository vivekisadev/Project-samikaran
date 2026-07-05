/**
 * Converts a Google Drive sharing URL into a direct image/file embed link.
 * If the provided URL is not a Google Drive link, it returns the URL untouched.
 * 
 * Target format for embedded images: https://drive.google.com/uc?export=view&id=FILE_ID
 */
export const convertDriveLinkToDirect = (url) => {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('drive.google.com')) {
      // Handle the /file/d/ID/view format
      const match = url.match(/\/file\/d\/([^\/]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
      
      // Handle the /open?id=ID format
      const idParam = urlObj.searchParams.get('id');
      if (idParam) {
        return `https://drive.google.com/uc?export=view&id=${idParam}`;
      }
    }
    return url;
  } catch (err) {
    // If it's an invalid URL, just return it as is (e.g. relative paths or placeholders)
    return url;
  }
};
