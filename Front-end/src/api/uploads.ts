import api from './client';

export const uploadProductImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post<{ url: string }>('/uploads/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
