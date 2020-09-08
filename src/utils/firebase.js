import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";

const firebaseConfig = {
        apiKey: "AIzaSyCuFjYLqZPU8d-f0C1m9cfbiV7R36knhRo",
        authDomain: "trashhub-4dcae.firebaseapp.com",
        databaseURL: "https://trashhub-4dcae.firebaseio.com",
        projectId: "trashhub-4dcae",
        storageBucket: "trashhub-4dcae.appspot.com",
        messagingSenderId: "153616150485",
        appId: "1:153616150485:web:6b165592505c71a883175c",
        measurementId: "G-HCVHH2FHKL"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

export { db };


