import {useAuth} from "@/context/AuthContext";
import {Navigate} from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) return <div className={"page-loading"}>
        <span>
            Loading...
        </span>
    </div>;

    if (!user) return <Navigate to="/login" replace />;

    return <>{children}</>;
}