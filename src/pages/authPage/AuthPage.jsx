import React, { useState, useEffect } from "react";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, provider, db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./authPage.css";
import bookLogo from "../../images/icon.png"; // Assuming this exists based on Header.jsx

// Helper function to convert Firebase error codes to user-friendly messages
const getErrorMessage = (error) => {
    const errorCode = error.code;

    switch (errorCode) {
        // Authentication errors
        case 'auth/user-not-found':
            return 'Account does not exist. Please sign up first.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-email':
            return 'Invalid email address. Please check and try again.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists. Please sign in instead.';
        case 'auth/weak-password':
            return 'Password is too weak. Please use at least 6 characters.';
        case 'auth/operation-not-allowed':
            return 'This sign-in method is not enabled. Please contact support.';
        case 'auth/invalid-credential':
            return 'Invalid credentials. Please check your email and password.';
        case 'auth/account-exists-with-different-credential':
            return 'An account already exists with the same email but different sign-in method.';
        case 'auth/popup-closed-by-user':
            return 'Sign-in popup was closed. Please try again.';
        case 'auth/popup-blocked':
            return 'Sign-in popup was blocked by your browser. Please allow popups and try again.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/requires-recent-login':
            return 'Please sign in again to complete this action.';
        default:
            // Return a generic error message for unknown errors
            return 'An error occurred. Please try again.';
    }
};

const AuthPage = () => {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) return; // Wait for loading to finish

        if (user) {
            if (isAdmin) {
                navigate("/admin");
            } else {
                navigate("/");
            }
        }
    }, [user, isAdmin, authLoading, navigate]);

    // Mouse tracking for interactive background
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setErrorMessage("");
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user doc exists, if not create it with basic info from Google
            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    await setDoc(userDocRef, {
                        fullName: user.displayName || "User",
                        email: user.email,
                        createdAt: new Date(),
                    });
                }
            } catch (dbError) {
                console.warn("Firestore user profile creation failed (likely permissions or network blocker):", dbError);
                // Continue to navigate even if DB save fails, as Auth was successful
            }

            // navigate("/") - Handled by useEffect
        } catch (error) {
            console.error(error);
            setErrorMessage(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            if (isLogin) {
                // Sign In
                await signInWithEmailAndPassword(auth, email, password);
                // navigate("/") - Handled by useEffect
            } else {
                // Sign Up
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Save additional info to Firestore
                try {
                    await setDoc(doc(db, "users", user.uid), {
                        fullName,
                        email,
                        createdAt: new Date(),
                    });
                } catch (dbError) {
                    console.warn("Firestore user profile creation failed:", dbError);
                }

                // navigate("/") - Handled by useEffect
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Animated Background */}
            <div className="auth-background">
                <div
                    className="bg-circle bg-circle-1"
                    style={{
                        transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
                    }}
                />
                <div
                    className="bg-circle bg-circle-2"
                    style={{
                        transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.015}px)`
                    }}
                />
                <div
                    className="bg-circle bg-circle-3"
                    style={{
                        transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.01}px)`
                    }}
                />
                <div
                    className="bg-circle bg-circle-4"
                    style={{
                        transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.015}px)`
                    }}
                />
                <div
                    className="bg-circle bg-circle-5"
                    style={{
                        transform: `translate(${mousePosition.x * 0.025}px, ${mousePosition.y * -0.02}px)`
                    }}
                />
            </div>
            <div className="auth-card">
                <div className="auth-header">
                    <img src={bookLogo} alt="BookByte" className="auth-logo" />
                    <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
                    <p className="auth-subtitle">
                        {isLogin ? "Sign in to access your library reservations" : "Join BookByte to reserve books"}
                    </p>
                </div>

                {errorMessage && <p className="auth-error">{errorMessage}</p>}

                <form onSubmit={handleEmailAuth} className="auth-form">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email Address"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit" disabled={loading} className="auth-main-btn">
                        {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>OR</span>
                </div>

                <button onClick={handleGoogleSignIn} disabled={loading} className="auth-google-btn">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                    {isLogin ? "Sign in with Google" : "Sign up with Google"}
                </button>

                <p className="auth-toggle">
                    {isLogin ? "New to BookByte?" : "Already hava an account?"}{" "}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Create Account" : "Sign In"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
