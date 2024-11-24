// firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyAEw9353xS1az8fl6yDbwxeqGR9E4dT7h0",
    authDomain: "loc-60f9d.firebaseapp.com",
    databaseURL: "https://loc-60f9d-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "loc-60f9d",
    storageBucket: "loc-60f9d.firebasestorage.app",
    messagingSenderId: "530676836005",
    appId: "1:530676836005:web:565aab01da59f6ba9c4f4c",
    measurementId: "G-47CS0L8VF1"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
