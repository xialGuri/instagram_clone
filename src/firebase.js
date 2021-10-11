import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD-zlxuTlIIkNZOFWnhSFCfk3FufEnMvtE",
    authDomain: "instagram-clone-c90b1.firebaseapp.com",
    databaseURL: "https://instagram-clone-c90b1-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-c90b1",
    storageBucket: "instagram-clone-c90b1.appspot.com",
    messagingSenderId: "158299694045",
    appId: "1:158299694045:web:d1f8a5b54258d0d2accc34",
    measurementId: "G-F1KXDMJT7M"
});

//firebase로 부터 세가지의 서비스를 받아볼수 있다. 
//db로 접근한다.
const db = firebaseApp.firestore();
//로그인, 로그아웃시 필요한 인증
const auth = firebase.auth();
//사진과 같은 것을 파이어베이스에 업로드 할때 필요
const storage = firebase.storage();


export { db, auth, storage };