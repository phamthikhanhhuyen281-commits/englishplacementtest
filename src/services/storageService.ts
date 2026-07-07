import { ref, uploadBytes, getDownloadURL, uploadString } from 'firebase/storage';
import { storage } from '../firebase';

export const storageService = {
  /**
   * Upload a File object (from file input / drag & drop) to Firebase Storage
   */
  async uploadFile(file: File, folderPath: string): Promise<string> {
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const uniqueName = `${Date.now()}_${cleanName}`;
      const fileRef = ref(storage, `${folderPath}/${uniqueName}`);
      
      const snap = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(snap.ref);
      return downloadUrl;
    } catch (err) {
      console.error('Error uploading file to Firebase Storage:', err);
      throw err;
    }
  },

  /**
   * Upload base64 encoded audio string to Firebase Storage
   */
  async uploadBase64Audio(base64Data: string, candidateId: string, part: string): Promise<string> {
    try {
      // Strip metadata if present (e.g. "data:audio/webm;base64,...")
      let cleanBase64 = base64Data;
      if (base64Data.includes(',')) {
        cleanBase64 = base64Data.split(',')[1];
      }
      
      const fileRef = ref(storage, `candidates/${candidateId}/${part}.webm`);
      const snap = await uploadString(fileRef, cleanBase64, 'base64', {
        contentType: 'audio/webm'
      });
      const downloadUrl = await getDownloadURL(snap.ref);
      return downloadUrl;
    } catch (err) {
      console.error('Error uploading base64 audio to Firebase Storage:', err);
      throw err;
    }
  }
};
