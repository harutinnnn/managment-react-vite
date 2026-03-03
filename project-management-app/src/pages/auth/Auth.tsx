import "./Login.css";
import {Login} from "@/pages/auth/Login";
import {useState} from "react";
import {Register} from "@/pages/auth/Register";
import {Forgot} from "@/pages/auth/Forgot";

const Auth = () => {


    const [loginPage, setLoginPage] = useState(true);
    const [forgot, setForgot] = useState(false);


    return (
        <div className="auth-container">
            <div className={"auth-container"}>
                <div className="auth-form">

                    {!forgot ? (loginPage ? <Login cb={() => {
                        setForgot(true)
                    }}/> : <Register/>) : <Forgot/>}

                    <div>
                        <div className="btn" onClick={() => setLoginPage(prevState => !prevState)}>
                            {loginPage ? "Register new company" : "Login"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;