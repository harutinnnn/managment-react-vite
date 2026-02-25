import { useState, useEffect, useMemo } from "react";
import { getMeRequest, refreshRequest } from "@/api/auth.api";
import { AxiosError } from "axios";
import { User } from "@/types/User";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function restoreSession() {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) return setLoading(false);

                const userFromApi = await getMeRequest();
                setUser(userFromApi);
            } catch (err) {
                if (err instanceof AxiosError) {
                    const refreshToken = localStorage.getItem("refreshToken");
                    if (refreshToken) {
                        const refresh = await refreshRequest(refreshToken);
                        localStorage.setItem("accessToken", refresh.token);
                        const userFromApi = await getMeRequest();
                        setUser(userFromApi);
                    } else logout();
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

    const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
