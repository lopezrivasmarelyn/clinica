import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'proyecto-medico-eb071',
  appId: '1:863635997361:web:b26d5c70bc1ebf1a5b9890',
  storageBucket: 'proyecto-medico-eb071.firebasestorage.app',
  apiKey: 'AIzaSyBxLqTCeAjfnRet1A92QAHtSh1kzyUVcvI',
  authDomain: 'proyecto-medico-eb071.firebaseapp.com',
  messagingSenderId: '863635997361',
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
