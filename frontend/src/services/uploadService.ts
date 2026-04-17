import api from '../lib/axios';

export const uploadService = {
  uploadImage: async (file: File, type: 'post' | 'avatar' | 'content' = 'post') => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/upload?type=${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
