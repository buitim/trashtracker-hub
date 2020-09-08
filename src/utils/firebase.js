import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";

const firebaseConfig = {
        apiKey: "***REMOVED***",
        authDomain: "***REMOVED***.firebaseapp.com",
        databaseURL: "https://***REMOVED***.firebaseio.com",
        projectId: "***REMOVED***",
        storageBucket: "***REMOVED***.appspot.com",
        messagingSenderId: "153616150485",
        appId: "1:153616150485:web:6b165592505c71a883175c",
        measurementId: "G-HCVHH2FHKL"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

export { db };


