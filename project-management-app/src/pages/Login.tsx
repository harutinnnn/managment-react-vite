import "./Login.css";
import {useAuth} from "@/context/AuthContext";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {loginRequest} from "@/api/auth.api";

const Login = () => {

    const {login} = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const data = await loginRequest({ email, password });
            console.log(data);

            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);

            login(data.token, data.user);

            navigate("/");

        } catch (err: any) {

            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className={"login-container"}>
            <div className="login-form">

                <h1 className={"mb-20"}>Sign In</h1>

                <form action="" onSubmit={handleSubmit}>
                    <div className={"input-row"}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={"input-row"}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className={"input-row"}>
                        <button className={'btn  '}>Sign in</button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default Login;