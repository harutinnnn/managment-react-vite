import { createContext, useContext, useEffect, useState } from "react";
import { getMeRequest } from "@/api/auth.api";
import api from "@/api/axios"; // <-- import your API call

type User = {
    id: number;
    email: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function restoreSession() {
            try {
                // First try with current access token
                let userFromApi = await getMeRequest();
                setUser(userFromApi);
            } catch (err: any) {
                if (err.response?.status === 401) {
                    // Access token expired → try refresh
                    try {
                        const refreshResponse = await api.post("/auth/refresh", {}, { withCredentials: true });
                        const newAccessToken = refreshResponse.data.accessToken;

                        localStorage.setItem("accessToken", newAccessToken);

                        // Retry /auth/me with new access token
                        const userFromApi = await getMeRequest();
                        setUser(userFromApi);
                    } catch {
                        // Refresh failed → logout
                        logout();
                    }
                } else {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        }

        restoreSession();
    }, []);

    const login = (token: string, user: User) => {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}