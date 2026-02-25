import {createContext, useContext, useEffect, useState} from "react";
import {getMeRequest, refreshRequest} from "@/api/auth.api";
import {AxiosError} from "axios";
import {User} from "@/types/User";

export type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function restoreSession() {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    setLoading(false);
                    return;
                }

                const userFromApi = await getMeRequest();

                setUser(userFromApi);

            } catch (err) {

                if (err instanceof AxiosError) {

                    console.log(err.code);

                    const refreshToken = localStorage.getItem("refreshToken");
                    console.log('refreshToken ', refreshToken);

                    if (refreshToken) {

                        const refresh = await refreshRequest(refreshToken)

                        localStorage.setItem("accessToken", refresh.token);

                        const userFromApi = await getMeRequest();

                        setUser(userFromApi);

                    } else {
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
        <AuthContext.Provider value={{user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}