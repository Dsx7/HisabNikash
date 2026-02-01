'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged, 
    GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import axios from 'axios';
import HNLoader from '@/components/HNLoader'; // <--- New Import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null); // User data from MongoDB (Role, etc)
    const [loading, setLoading] = useState(true);

    // Sync with MongoDB
    const syncUserWithBackend = async (firebaseUser) => {
        try {
           // const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/sync`, {
            const res = await axios.post('/api/users/sync', {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL
            });
            setDbUser(res.data.user); // Store MongoDB user data (includes role)
        } catch (error) {
            console.error("Sync Error:", error);
        }
    };

    const googleLogin = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const logout = () => {
        setDbUser(null);
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await syncUserWithBackend(currentUser);
            } else {
                setDbUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // --- UPDATED LOADING LOGIC ---
    // If Firebase is checking auth status, show the HNLoader
    if (loading) {
        return (
            <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-background">
                <HNLoader size="text-8xl md:text-9xl" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, dbUser, googleLogin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);