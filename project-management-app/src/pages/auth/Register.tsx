import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthContext";
import {loginRequest, registerRequest} from "@/api/auth.api";

export const Register = () => {
    const {login} = useAuth();
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const data = await registerRequest({companyName, name, email, password, address});

            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);

            login(data.token, data.user);

            navigate("/");

        } catch (err: any) {

            setError(err.response?.data?.message || "Login failed");
        }
    };


    return (
        <div>


            <h1 className={"mb-20"}>Sign Up</h1>

            <form action="" onSubmit={handleSubmit}>

                <div className={"input-row"}>
                    <label htmlFor="companyName">Company name *</label>
                    <input
                        type="text"
                        id="companyName"
                        placeholder="Company name" value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />
                </div>


                <div className={"input-row"}>
                    <label htmlFor="name">Your name *</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Company name" value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>


                <div className={"input-row"}>
                    <label htmlFor="email">Your Email *</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={"input-row"}>
                    <label htmlFor="password">Password *</label>
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
                    <label htmlFor="address">Company address (optional)</label>
                    <input
                        type="text"
                        id="address"
                        placeholder="Address" value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>


                <div className={"input-row"}>
                    <button className={'btn primary'}>Register</button>
                </div>
            </form>

        </div>

    )

}