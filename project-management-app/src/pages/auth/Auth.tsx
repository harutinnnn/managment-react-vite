import "../Login.css";
import {Login} from "@/pages/auth/Login";
import {useState} from "react";
import {Register} from "@/pages/auth/Register";

const Auth = () => {


    const [loginPage, setLoginPage] = useState(true);


    return (
        <div className="auth-container">
            <div className={"auth-container"}>
                <div className="auth-form">

                    {loginPage ? <Login/> : <Register/>}

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