
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ALLOWED_EMAILS = [
  'navyugmgalani@gmail.com',
  'navyugenterprise2003@gmail.com'
];

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.email && ALLOWED_EMAILS.includes(user.email)) {
          setAdmin({
            id: user.uid,
            email: user.email,
            name: user.displayName || 'Admin'
          });
        } else {
          // If logged in but not with an allowed email, log out immediately
          console.error("Unauthorized email access attempt:", user.email);
          await signOut(auth);
          setAdmin(null);
          toast({
            title: "Access Denied",
            description: "This email is not authorized to access the admin panel.",
            variant: "destructive",
          });
        }
      } else {
        setAdmin(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email && ALLOWED_EMAILS.includes(user.email)) {
        return { success: true };
      } else {
        await signOut(auth);
        return { success: false, error: "Unauthorized email address" };
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, loginWithGoogle, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
