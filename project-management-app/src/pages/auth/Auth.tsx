import "./Login.css";
import {Login} from "@/pages/auth/Login";
import {useState} from "react";
import {Register} from "@/pages/auth/Register";
import {Forgot} from "@/pages/auth/Forgot";

const Auth = () => {


    const [loginPage, setLoginPage] = useState<'login' | 'register' | 'forgot'>('login');

    let page = <Login cb={(type) => {
        setLoginPage(type)
    }}/>

    if (loginPage === 'register') {
        page = <Register cb={(type) => {
            setLoginPage(type)
        }}/>
    } else if (loginPage === 'forgot') {
        page = <Forgot cb={(type) => {
            setLoginPage(type)
        }}/>
    } else if (loginPage === 'login') {
        page = <Login cb={(type) => {
            setLoginPage(type)
        }}/>
    }


    return (
        <div className="auth-container">
            <div className={"auth-container"}>
                <div className="auth-form">

                    {page}

                </div>
            </div>
        </div>
    );
};

export default Auth;