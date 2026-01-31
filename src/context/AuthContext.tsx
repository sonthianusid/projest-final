'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id?: number;
    username: string;
    password: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    role?: 'user' | 'admin';
    creditBalance?: number;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    register: (userData: User) => Promise<boolean>;
    updateProfile?: (profileData: Partial<Omit<User, 'username' | 'password' | 'role'>>) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loading: boolean;
    wallet: {
        balance: number;
        topUp: (amount: number) => void;
        deduct: (amount: number) => Promise<boolean>;
    };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success && data.user) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                return true;
            }

            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const register = async (userData: User): Promise<boolean> => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (data.success) {
                // Auto login after registration
                return await login(userData.username, userData.password);
            }

            return false;
        } catch (error) {
            console.error('Register error:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        router.push('/login');
    };

    const updateProfile = async (profileData: Partial<Omit<User, 'username' | 'password' | 'role'>>): Promise<boolean> => {
        if (!user) return false;

        try {
            // Optimistic update (optional, but good for UX) or wait for API
            // Let's wait for API to be safe

            // Only call API if meaningful data (skip if just creditBalance which is handled separately or ignoring API support for it)
            // But for now, we try to update what we can.
            // Our API only updates name, email, phone, address.

            const response = await fetch('/api/auth/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: user.id, ...profileData }),
            });

            // If API fails (e.g. 404), we might still want to update local if it's creditBalance?
            // But creditBalance is client-side logic in this app.
            // Let's check response success only for profile fields.

            // For simplicity: Always update local state if it's a client-side only field OR if API success.
            // Current 'users' table has address.

            const updatedUser = { ...user, ...profileData };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist locally always for now to keep existing behavior

            return true;
        } catch (error) {
            console.error('Update profile error:', error);
            return false;
        }
    };

    const isAdmin = user?.role === 'admin';

    const wallet = {
        balance: user?.creditBalance || 0,
        topUp: (amount: number) => {
            if (!user) return;
            const newBalance = (user.creditBalance || 0) + amount;
            updateProfile({ creditBalance: newBalance });
        },
        deduct: async (amount: number): Promise<boolean> => {
            if (!user) return false;
            const currentBalance = user.creditBalance || 0;
            if (currentBalance < amount) return false;

            const newBalance = currentBalance - amount;
            await updateProfile({ creditBalance: newBalance });
            return true;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            updateProfile,
            logout,
            isAuthenticated: !!user,
            isAdmin,
            loading,
            wallet
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
