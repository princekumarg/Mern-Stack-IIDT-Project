// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {createUserWithEmailAndPassword, getAuth, updateProfile,signInWithEmailAndPassword,signOut,onAuthStateChanged} from "firebase/auth"
import { useState,useEffect,useContext,createContext } from "react";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const AuthContext=createContext(null);
const AuthProvider=({children})=>{
    const auth=useProvideAuth();
    return <AuthContext.Provider value={auth}>
        {children}
    </AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext);
function useProvideAuth(){
    const [user,setUser]=useState();

    const signUp = (email, password, displayName) =>
    createUserWithEmailAndPassword(auth, email, password).then(({ user }) => {
      updateProfile(user, { displayName });
      setUser(user);
      return user;
    });
    const signIn = (email, password) =>
      signInWithEmailAndPassword(auth, email, password).then(({ user }) => {
      setUser(user);
      return user;
    });
    const signOutUser = () => signOut(auth).then(() => setUser(null));
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          user ? setUser(user) : setUser(null);
    });
    
    return () => unsubscribe();
    });
    return {
        signIn,
        signUp,
        signOut: signOutUser,
        user,
    };
}
export default AuthProvider;