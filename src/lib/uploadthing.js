import { generateUploadButton, generateUploadDropzone } from '@uploadthing/react';

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const UploadButton = generateUploadButton({
  url: BACKEND_URL + '/api/uploadthing',
});

export const UploadDropzone = generateUploadDropzone({
  url: BACKEND_URL + '/api/uploadthing',
});
