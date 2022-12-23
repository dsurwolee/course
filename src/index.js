import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';

import { BrowserRouter as Router, useNavigate, Navigate, Route, Routes } from "react-router-dom";

import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMsiGIVP6-NGgqWQHYQMyIZLIPZOTFZSo",
  authDomain: "course-64784.firebaseapp.com",
  projectId: "course-64784",
  storageBucket: "course-64784.appspot.com",
  messagingSenderId: "803028178061",
  appId: "1:803028178061:web:e05781401487b4eeddfec4",
  measurementId: "G-0NCMBCLQK4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);

const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

const logout = () => {
    signOut(auth);
}

function Login() {

    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
            return;
        }
        if (user) navigate("/course");
    }, [user, loading]);

    // if (user) Navigate("/course")

    console.log('user', user)

    return (
        <div>
            <button onClick={signInWithGoogle}>Login with Google</button>        
        </div>
    )
}

function Course() {

    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
    })

    return (        

        <div>
            <div>
                Course Accessed!
            </div>
            <button onClick={logout}>Logout</button>
        </div>        
    )
}


function App() {

    // useEffect(() => {
    //     if (loading) {
    //         return;
    //     }
    //     if (user) Navigate("/course");
    // }, [user, loading]);

    // const [user, loading, error] = useAuthState(auth);
    // console.log('user', user)

    
    return (        

        <div>
            <div>DataInterview.com</div>
            <Router>
                <Routes>
                    <Route exact path="/" element={<Login />} />
                    <Route exact path="/course" element={<Course />} />
                </Routes>
            </Router>
        </div>              
    );
}

root.render(<App />)