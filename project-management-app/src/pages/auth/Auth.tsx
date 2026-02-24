import "../Login.css";
import {Login} from "@/pages/auth/Login";
import {useState} from "react";
import {Register} from "@/pages/auth/Register";

const Auth = () => {


    const [loginPage, setLoginPage] = useState(true);


    return (
        <div className="auth-container">
            {loginPage ? <Login/> : <Register/>}

            <div>
                <div onClick={() => setLoginPage(false)}>Login</div>
            </div>
        </div>
    );
};

export default Auth;