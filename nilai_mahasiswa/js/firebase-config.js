// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA07ESVwLOmw1PelLzReOPzQZuai3FE9nw",
  authDomain: "input-nilai-mahasiswa-14915.firebaseapp.com",
  projectId: "input-nilai-mahasiswa-14915",
  storageBucket: "input-nilai-mahasiswa-14915.firebasestorage.app",
  messagingSenderId: "540347041413",
  appId: "1:540347041413:web:631df56265afc0fb694bec",
  measurementId: "G-FFRZH1X70B"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// Ekspor instance Firestore untuk digunakan di logic.js
const db = firebase.firestore();

// Console log hanya untuk debugging (dihapus saat production)
console.log("Firebase initialized and Firestore instance created.");