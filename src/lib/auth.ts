import axios from "axios";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  sendPasswordResetEmail,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "./firebase";

const BACKEND_URL = "http://localhost:8000/api";

const syncUserWithBackend = async (idToken: string) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/sync`,
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error syncing user with backend:", error);
    throw new Error("Failed to sync user with backend.");
  }
};

const getFirebaseErrorMessage = (error: FirebaseError) => {
  const errorMessages: Record<string, string> = {
    "auth/email-already-in-use": "Email is already in use.",
    "auth/invalid-email": "Invalid email address.",
    "auth/user-not-found": "No user found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/account-exists-with-different-credential":
      "An account already exists with a different sign-in method. Please link your Google account.",
    "auth/early-verify": "Please verify your email address before logging in.", // Custom error for email not verified
  };

  return errorMessages[error.code] || "An unknown error occurred.";
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await user.getIdToken();
    await syncUserWithBackend(idToken);
    return { user, idToken };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Firebase error:", error);
      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData?.email as string;
        const pendingCred = GoogleAuthProvider.credentialFromError(error);
        if (email && pendingCred) {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          if (methods.includes("password")) {
            throw new Error(
              `An account exists with the email ${email}. Sign in using email/password to link your Google account.`
            );
          }
          const result = await signInWithPopup(auth, provider);
          await linkWithCredential(result.user, pendingCred);
          return { user: result.user, message: "Google account linked successfully!" };
        }
      }
      switch (error.code) {
        case "auth/popup-closed-by-user":
          throw new Error("Popup closed before completion. Please try again.");
        case "auth/cancelled-popup-request":
          throw new Error("Popup request was cancelled. Please try again.");
        default:
          throw new Error(getFirebaseErrorMessage(error));
      }
    }
    console.error("Unknown Google login error:", error);
    throw new Error("An unknown error occurred during Google sign-in.");
  }
};

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    await updateProfile(userCredential.user, { displayName: name });
    const idToken = await userCredential.user.getIdToken();
    await syncUserWithBackend(idToken);
    await signOut(auth);
    return { message: "Please verify your email before logging in." };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      throw new Error(getFirebaseErrorMessage(error));
    }
    throw new Error("Error signing up. Please try again.");
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
      const error = new Error("Please verify your email address before logging in.");
      error.name = "EmailNotVerifiedError"; // Custom error name
      throw error;
    }
    const idToken = await userCredential.user.getIdToken();
    await syncUserWithBackend(idToken);
    return { user: userCredential.user, idToken };
  } catch (error: unknown) {
    console.error("Error during login:", error);
    if (error instanceof Error) {
      if (error.name === "EmailNotVerifiedError") {
        throw new Error(error.message);
      }
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-credential":
            throw new Error("The credentials provided are invalid. Please check your email and password.");
          case "auth/user-not-found":
            throw new Error("No user found with this email.");
          case "auth/wrong-password":
            throw new Error("Incorrect password. Please try again.");
          case "auth/invalid-email":
            throw new Error("Invalid email format.");
          case "auth/too-many-requests":
            throw new Error("Too many failed attempts. Please try again later.");
          case "auth/email-already-in-use":
            throw new Error("Email is already in use.");
          default:
            throw new Error("An unknown error occurred.");
        }
      }
    }
    console.error("Unknown error:", error);
    throw new Error("An unknown error occurred while trying to log in.");
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error: unknown) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return "If an account is associated with this email, you'll receive a password reset email. Please check your inbox and follow the instructions.";
  } catch (error: unknown) {
    console.error("Error sending password reset email:", error);
    if (error instanceof FirebaseError) {
      throw new Error(getFirebaseErrorMessage(error));
    }
    throw new Error("Failed to send password reset email.");
  }
};

export const getCurrentUserProfile = () => {
  const user = auth.currentUser;
  if (user) {
    return {
      email: user.email || "",
      emailVerified: user.emailVerified,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      phoneNumber: user.phoneNumber || "",
      createdAt: user.metadata.creationTime || "",
      lastLoginAt: user.metadata.lastSignInTime || "",
    };
  }
  throw new Error("No authenticated user found.");
};

export const updateUserProfile = async (profile: {
  displayName?: string;
  photoURL?: string;
}) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No authenticated user found.");
  }
  try {
    await updateProfile(user, {
      displayName: profile.displayName,
      photoURL: profile.photoURL,
    });
    return { message: "Profile updated successfully!" };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      throw new Error(getFirebaseErrorMessage(error));
    }
    throw new Error("Failed to update profile.");
  }
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error("No authenticated user found. Please log in again.");
  }
  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    return { message: "Password updated successfully!" };
  } catch (error: unknown) {
    console.error("Error changing password:", error);
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/invalid-credential":
          throw new Error(
            "The provided credentials are invalid. Please ensure your current password is correct and try again."
          );
        case "auth/weak-password":
          throw new Error(
            "The new password is too weak. Please choose a stronger password with at least 6 characters."
          );
        case "auth/wrong-password":
          throw new Error(
            "The current password you entered is incorrect. Please double-check and try again."
          );
        case "auth/requires-recent-login":
          throw new Error(
            "Your session has expired. Please log in again to change your password."
          );
        case "auth/too-many-requests":
          throw new Error(
            "Too many failed attempts. Your account is temporarily locked. Please try again later."
          );
        case "auth/network-request-failed":
          throw new Error(
            "A network error occurred. Please check your internet connection and try again."
          );
        default:
          throw new Error(getFirebaseErrorMessage(error));
      }
    }
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};


